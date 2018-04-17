# -*- coding: utf-8 -*-

from string import Template

from django.db import models

from .account import Account
from .event import Event


class Investation(models.Model):
    account = models.ForeignKey(Account)
    summ = models.FloatField()
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)

    def __str__(self):
        return f"Investation: {self.account}({self.summ}) -> {self.event}"
    class Meta:
        unique_together = ('account', 'event')
