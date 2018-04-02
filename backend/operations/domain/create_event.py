# -*- coding: utf-8 -*-
from datetime import date

from backend.operations.domain.event import add_participants
from backend.operations.domain.account import push_money
from backend.models import Event, Investation
from backend.domain import OperationException

def add_investors(event, investors):
    if len(investors.keys()) == 0:
        return

    if event.price == reduce(lambda acc, s: acc + s, investors.values()):
        raise OperationException("event price should equal investors summ")

    for investor, summ in investors.items():
        Investation.objects.create(account=investor, summ=summ, event=event)


def create_event(name, price, author, participants=None, investors=None,
                 date=date.today()):
    """
    should create event and split price between investors(author if no
    investors) and create debts for participants if any.
    """
    # event should have at least one investor
    if investors is None:
        investors = {author: price}

    # TODO: check existance of investors, participants, author
    print('create_event::raw investors', investors)
    print('create_event::raw participants', participants)
    result_event = Event.objects.create(name=name, price=price, author=author,
                                        date=date)

    if investors:
        add_investors(result_event, investors)

    if participants:
        add_participants(result_event, participants)

    return result_event
