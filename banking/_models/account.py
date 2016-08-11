# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User
from banking.operations.domain.utils import sumQuery


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

    def balance(self):
        from .transfer import Transfer
        from .transaction import Transaction
        from banking.operations.domain.utils import round_up

        res = round_up(float(Transfer.objects.filter(account=self).
                    aggregate(**sumQuery('sum'))['sum'] or 0), 2)
        res += round_up(float(Transaction.objects.filter(participation__account=self).
                     aggregate(**sumQuery('sum'))['sum'] or 0), 2)
        return round_up(res, 2)

    def __str__(self):
        return self.user.__str__()
