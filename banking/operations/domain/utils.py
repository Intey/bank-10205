from django.db.models import F, Sum


def sumQuery(field):
    """ usage: queryset.aggregate(**sumQuery('s'))['s'] """
    return {field: Sum(F('debit') - F('credit'))}


def round_up(value, digits=5):
    """ Round float up and leave only digits count after colon """
    from math import ceil
    power = 10 ** digits
    return ceil(value * power) / power


def round_down(value, digits):
    """ Works line ceil but for floats. round_down(3.334, 2) == 3.33 """
    from math import ceil
    power = 10 ** digits
    return int(value * power) / power

