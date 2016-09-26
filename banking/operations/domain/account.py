from banking.models import Transfer


def push_money(account, count):
    """Account push money to bank."""
    t = Transfer(account=account, debit=count)
    t.save()
    return True


def out_money(account, count):
    """account call to get money from the bank. Make every effort that he did
    not do this(joke)."""
    if account.balance() >= count:
        Transfer.objects.create(account=account, credit=count)
        return True
    return False


def debt(account):
    from banking.models import Transaction
    from banking.operations.domain.utils import round_up, sumQuery
    res = float(Transaction.objects.filter(participation__account=account).
            aggregate(**sumQuery('sum'))['sum'] or 0)
    return res
