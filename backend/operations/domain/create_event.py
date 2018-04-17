# -*- coding: utf-8 -*-
from datetime import date
from functools import reduce

from backend.models import Event, Investation, Transaction
from backend.operations.domain import OperationException
from backend.operations.domain.event import add_participants


def add_investors(event, investors):
    if len(investors.keys()) == 0:
        return
    investors_sum = sum(investors.values())
    if event.price != investors_sum:
        raise OperationException(f"event price ({event.price}) should equal investors sum ({investors_sum})")

    for investor, summ in investors.items():
        Investation.objects.create(account=investor, summ=summ, event=event)


def create_event(name, price, author, participants=None, investors=None,
                 date=date.today()):
    """
    should create event and split price between investors(author if no
    investors) and create debts for participants if any.
    """
    # event should have at least one investor
    if investors is None or len(investors.keys()) == 0:
        investors = {author: price}

    # TODO: check existance of investors, participants, author
    result_event = Event.objects.create(name=name, price=price, author=author,
                                        date=date)

    if investors:
        add_investors(result_event, investors)

    if participants:
        add_participants(result_event, participants)

    return result_event
