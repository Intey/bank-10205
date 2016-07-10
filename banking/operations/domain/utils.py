from django.db.models import F, Sum


def sumQuery(field):
    """ usage: queryset.aggregate(**sumQuery('s'))['s'] """
    return {field: Sum(F('debit') - F('credit'))}
