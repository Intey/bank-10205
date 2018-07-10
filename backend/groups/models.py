# -*- coding: utf-8 -*-

from django.db import models

from backend.models.account import Account
from string import Template


out = Template("$account: $parts")


class Group(models.Model):
    name = models.CharField(max_length=100)


class GroupParticipation(models.Model):
    account = models.ForeignKey(Account, related_name='groups')
    parts = models.FloatField(default=1.0)
    group = models.ForeignKey(Group, related_name='participants')

    def __str__(self):
        return out.substitute(account=self.account, parts=self.parts)

    class Meta:
        unique_together = ('account', 'parts', 'group')

