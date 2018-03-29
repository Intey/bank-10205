# -*- coding: utf-8 -*-
from backend.operations.domain.event import add_participants
from backend.operations.domain.account import push_money
from backend.models import Event


def create_event(name, price, author, participants=None, investors=None):
    """
    should create event and split price between investors(author if no
    investors) and create debts for participants if any.
    """
    # event should have at least one investor
    if not investors:
        investors = {author: price}

    e = Event.objects.create(name=name, price=price, author=author)

    parts = sum(investors.values())
    party_pay = e.price / parts

    for investor, count in investors.items():
        push_money(investor, party_pay * count)

    if participants:
        add_participants(e, participants)
