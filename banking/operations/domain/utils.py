from django.db.models import F, Sum


def aggregateSumm(queryset):
    """ calculate difference between 'debit' and 'credit'
    usage: aggregateSumm(Transaction.objects.all())
    Return: *all_debits - *all_credits """
    return round_up(queryset.aggregate(**sumQuery('_'))['_'])


def sumQuery(field):
    """ usage: queryset.aggregate(**sumQuery('s'))['s'] """
    return {field: Sum(F('debit') - F('credit'))}


def round_up(value, digits=4):
    """ Round float up and leave only digits count after colon """
    from decimal import Context, ROUND_UP as ROUND_MODEL
    from math import modf

    frac, whole = modf(value)
    d = Context(rounding=ROUND_MODEL, prec=digits).create_decimal(str(frac))
    return float(+d) + whole

def round_down(value, digits=4):
    """ Works line ceil but for floats. round_down(3.334, 2) == 3.33 """
    from decimal import Context, ROUND_HALF_DOWN as ROUND_MODEL
    from math import modf

    frac, whole = modf(value)
    d = Context(rounding=ROUND_MODEL, prec=digits).create_decimal(str(frac))
    return float(+d) + whole
