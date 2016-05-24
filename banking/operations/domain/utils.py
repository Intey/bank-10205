from django.db.models import F, Sum


def sumQuery(field):
    return {field: Sum(F('debit') - F('credit'))}
