# -*- coding: utf-8 -*-

from string import Template

from django.db import models

from .participation import Participation


class Transaction(models.Model):
    DIFF = 'DF'
    PARTICIPATE = 'IN'
    INIT = 'NW'
    OUT = 'OT'

    TYPES = (
        (INIT, 'initial'),
        (DIFF, 'diff'),
        (PARTICIPATE, 'participation'),
        (OUT, 'leave')
    )
    participation = models.ForeignKey(Participation)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(default=0, verbose_name="credit: account pay")
    debit = models.FloatField(default=0, verbose_name="debit: account get from event")
    type = models.CharField(max_length=2, choices=TYPES, default=PARTICIPATE)
    parent = models.ForeignKey("self", null=True, blank=True)

    def summ(self):
        """ Return summ of debit and credit. Used for displaying """
        return round(self.debit - self.credit, 2)

    def type_view(self):
        """ Return string view of transaction type.  """
        ret = "Неизвестно"
        if self.type == 'DF':
            ret = "Перерасчет"
        elif self.type == 'IN':
            ret = 'Оплата'
        elif self.type == 'NW':
            ret = 'Участие'
        elif self.type == 'OT':
            ret = 'Уход'
        return ret

    def __str__(self):
        account = self.participation.account
        parts = self.participation.parts
        event = self.participation.event
        out = Template("$id|$type$parent:$account($parts) $direction $event = $summ")

        if self.credit == 0:
            summ = self.debit
            direction = "<-"
        else:
            summ = self.credit
            direction = "->"
        # show parent only for diff transactions
        if self.type == self.DIFF and self.parent:
            parent = "[%s]" % self.parent.id
        else:
            parent = ""

        return out.substitute(id=self.id, type=self.type, parent=parent,
                              account=account, event=event, parts=parts,
                              summ=summ, direction=direction)
