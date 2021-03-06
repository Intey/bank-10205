# -*- coding: UTF-8 -*-

from django.db.models import Sum, Q
from backend.models import Transaction, Account, Participation
from backend.operations.utils.trash import deNone
from backend.operations.domain.calcs import diff_sum
from backend.operations.domain.utils import round_up, round_down


def get_participants(event):
    """Get participants of Event

    @return:  participants List of dicts, where keys: 'account', 'parts'.
              'parts' - is participation rate(parts).
    @rtype :  List
    """
    accs_rates = Participation.objects.filter(event=event, active=True)\
        .values('account', 'parts').distinct()
    for p in accs_rates:
        p.update({'account': Account.objects.get(id=p['account'])})
    return accs_rates


def add_participants(event, newbies):
    """Add participants in event. Takes dict, where keys - is account
    models and values is participation part(int)."""
    if len(newbies) == 0:
        return
    # calc party-pay,
    participants = Participation.objects.filter(event=event, active=True)
    exist_parts = deNone(participants.aggregate(s=Sum('parts'))['s'], 0.0)
    all_parts = exist_parts + sum(newbies.values())
    party_pay = round_up(event.price / all_parts)
    parent_transactions = {}
    # participate incomers
    for (acc, parts) in newbies.items():
        participation, is_update = _create_participation(event, acc, parts)
        summ = party_pay * parts
        transaction_type = Transaction.PARTICIPATE
        # update exist participation for concrete account
        if is_update:
            old_parts = participation.parts - parts
            new_parts = participation.parts
            summ = diff_sum(old_parts/exist_parts, new_parts/all_parts,
                            event.price)
            transaction_type = Transaction.DIFF

        transaction = Transaction(participation=participation,
                                  type=transaction_type)
        transaction.credit = summ
        transaction.save()
        parent_transactions[transaction] = summ

    recalc_participations = participants.filter(~Q(account__in=newbies.keys()))
    _update_oldies(recalc_participations, parent_transactions)


def remove_participants(event, leavers):
    leavers = _is_participated(event, leavers)
    if not leavers:
        return

    participants = Participation.objects.filter(event=event, active=True)

    exist_parts = participants.aggregate(s=Sum('parts'))['s']
    exist_parts = 0.0 if exist_parts is None else exist_parts  # fix None
    party_pay = event.price / exist_parts

    rest_participations = participants.filter(~Q(account__in=leavers))

    leaver_participations = participants.filter(account__in=list(leavers))
    # return money

    for participation in leaver_participations:
        leaver_transaction = Transaction(participation=participation,
                                         type=Transaction.OUT)
        debit = party_pay * participation.parts
        leaver_transaction.debit = debit
        leaver_transaction.save()
        # create diffs
        # yep folks, you should pay for this leavers
        rest_parts = rest_participations.aggregate(s=Sum('parts'))['s']
        for victum in rest_participations:
            credit = ((leaver_transaction.debit / rest_parts)
                      * victum.parts)
            _delegate_debt(victum, credit, leaver_transaction)

    leaver_participations.update(active=False)


def _update_event_price(event, new_price):
    if event.price == new_price:
        return

    # positive - price up, should make credits
    price_diff = new_price - event.price
    event.price = new_price
    event.save()

    participations = Participation.objects.filter(event=event)
    all_parts = participations.aggregate(s=Sum('parts'))['s']
    for participation in participations:
        tr = Transaction(participation=participation, type=Transaction.DIFF)
        if price_diff > 0:
            tr.credit = abs(round_up(round_down((price_diff / all_parts) * participation.parts)))
        else:
            tr.debit = abs(round_up(round_down((price_diff / all_parts) * participation.parts)))
        tr.save()


def _delegate_debt(participation, credit, parent):
    """Make diff transactions for given participation(event,user) with given
    credit. This means, that we get money from user and spend it to event.

    @param participation:  Event-User link that for create transaction
    @type  participation:  Participation

    @param debit:  Money count that was returned
    @type  debit:  float

    @param parent:  Parent transaction, that initiate return(incomer for
                    example)
    @type  parent:  Transaction
    """
    t = Transaction(participation=participation, type=Transaction.DIFF,
                    parent=parent)
    t.credit = credit
    t.save()


def _return_money(participation, debit, parent):
    """Make diff transactions for given participation(event,user) with given
    debit. This means, that we get money from event and return it to user.

    @param participation:  Event-User link that for create transaction
    @type  participation:  Participation

    @param debit:  Money count that was returned
    @type  debit:  float

    @param parent:  Parent transaction, that initiate return(incomer for
                    example)
    @type  parent:  Transaction
    """
    t = Transaction(participation=participation, type=Transaction.DIFF,
                    parent=parent)
    t.debit = debit
    t.save()


def _is_participated(event, accounts):
    """Check which accounts participated in event.

    @param accounts:  Accounts for checks
    @type  accounts:  Collection, that can used in Q object as field__in=[]

    @return:  Collection with accounts, that participated
    @type : set of participated accounts
    """

    out = set()
    participants = Participation.objects.filter(event=event,
                                                account__in=accounts,
                                                active=True)
    for p in participants:
        out.add(p.account)
    return out


def _update_oldies(recalc_participations, parent_transactions):
    """ create diffs for old participants. If no recalc_participations(incomers
    if first participants) we have exist_parts = 0 """
    recalcers_parts = recalc_participations.aggregate(s=Sum('parts'))['s']
    for parent_transaction, summ in parent_transactions.items():
        for participation in recalc_participations:
            _create_diff(participation, parent_transaction, summ, recalcers_parts)


def _create_participation(event, account, parts):
    """ Participate account in event with given parts(coefficient).
    If Participation alredy exists - it's will be used """
    # if not already participated
    new_participation =\
        Participation.objects.filter(account=account, event=event).first()
    is_update = False

    # new participation
    if not new_participation:
        new_participation = Participation(account=account,
                                          parts=parts,
                                          event=event)

    # already participated. Update
    if new_participation.active:
        new_participation.parts += parts
        is_update = True

    new_participation.active = True
    new_participation.save()
    return (new_participation, is_update,)


def _create_diff(participation, parent_transaction, summ, exist_parts):
    """ Create diff transaction for given participation. Diff
    transactions links to parent_transaction as diff initiator. exist_parts -
    parts that exists before. """
    debit = (round_down(summ / exist_parts)
             * participation.parts)
    print("create diff with debit:", debit, "parent:", summ)
    _return_money(participation, debit, parent_transaction)
