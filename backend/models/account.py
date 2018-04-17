# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import AbstractBaseUser
# TODO: replace link to user with inheritance of AbstractUser
# from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from backend.operations.domain.utils import sumQuery


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

    def balance(self):
        from .transfer import Transfer
        from .transaction import Transaction
        from .investation import Investation
        from backend.operations.domain.utils import round_up

        res  = round_up(float(Transfer.objects.filter(account=self).
                              aggregate(**sumQuery('sum'))['sum'] or 0), 2)
        res += round_up(float(Transaction.objects.filter(participation__account=self).
                              aggregate(**sumQuery('sum'))['sum'] or 0), 2)
        res += round_up(float(Investation.objects.filter(account=self).
                              aggregate(summ=Sum('summ'))['summ'] or 0), 2)
        return round_up(res, 2)

    def __str__(self):
        return self.user.__str__()
