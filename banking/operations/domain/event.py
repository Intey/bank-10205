# -*- coding: utf-8 -*-

from django.db.models import Sum, Q
from banking.models import Transaction, Account, Participation
from banking.operations.utils.trash import deNone


def delegate_debt(participation, credit, parent):
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


def return_money(participation, debit, parent):
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


def is_participated(event, accounts):
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


def add_participants(event, newbies):
    """Add participants in event. Takes dict, where keys - is account
    models and values is participation part(int)."""

    if len(newbies) == 0:
        return
    # calc party-pay,
    participants = Participation.objects.filter(event=event, active=True)

    exist_parts = deNone(participants.aggregate(s=Sum('parts'))['s'], 0.0)
    all_parts = exist_parts + sum(newbies.values())

    party_pay = event.price / all_parts
    recalcers = participants.filter(~Q(account__in=newbies.keys()))
    parent_transactions = []
    # participate incomers
    for (acc, parts) in newbies.items():
        participation = participate(event, acc, parts)

        tr = Transaction(participation=participation,
                         type=Transaction.PARTICIPATE)
        tr.credit = party_pay * parts
        parent_transactions.append(tr)
        tr.save()

    # create diffs for old participants
    # if no recalcers(incomers if first participants) we have exist_parts = 0
    for newbie_transaction in parent_transactions:
        for participation in recalcers:
            assert (exist_parts != 0),\
                "On add participants when we need recalc exist participants\
                exist_parts should be positive(not zero)"
            debit = ((newbie_transaction.credit / exist_parts)
                     * participation.parts)
            return_money(participation, debit, newbie_transaction)


def participate(event, account, parts):
    """ Participate account in event with given parts(coefficient).
    If Participation alredy exists - it's will be used """
    # if not already participated
    new_participation =\
        Participation.objects.filter(account=account, event=event).first()

    # new participation
    if not new_participation:
        new_participation = Participation(account=account,
                                          parts=parts,
                                          event=event)

    # already participated
    if new_participation.active:
        new_participation.parts += parts

    new_participation.active = True
    new_participation.save()
    return new_participation


def remove_participants(event, leavers):
    # check, that leaver is participated
    leavers = is_participated(event, leavers)
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
            delegate_debt(victum, credit, leaver_transaction)

    leaver_participations.update(active=False)
