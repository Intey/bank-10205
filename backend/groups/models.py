# -*- coding: utf-8 -*-

from django.db import models

from backend.models.account import Account
from string import Template


out = Template("$account: $parts")


class GroupParticipation(models.Model):
    account = models.ForeignKey(Account)
    parts = models.FloatField(default=1.0)

    def __str__(self):
        return out.substitute(account=self.account, parts=self.parts)

    class Meta:
        unique_together = ('account', 'parts')


class Group(models.Model):
    name = models.CharField(max_length=100)
    participants = models.ManyToManyField(GroupParticipation, related_name='groups')

