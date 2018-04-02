# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.test import TestCase

from backend.models import Event, Account, Transaction, Transfer, Participation
from backend.operations.domain.create_event import create_event
from backend.operations.domain.utils import aggregateSumm, round_up, round_down
from backend.operations.domain.account import debt


class CreateEventTest(TestCase):
    def setUp(self):
        u1 = User.objects.create(username="Author")
        u2 = User.objects.create(username="author2")
        u3 = User.objects.create(username="author3")

        self.author1 = Account.objects.create(user=u1, rate=1)
        self.author2 = Account.objects.create(user=u2, rate=1)
        self.author3 = Account.objects.create(user=u3, rate=1)

    def test_single_author(self):
        create_event('cookies', 3000, self.author1)

        self.assertEqual(self.author1.balance(), 3000)

    def test_many_authors_balanced(self):
        create_event('cookies', 3000, self.author1,
                     investors={self.author1: 1, self.author2: 1})

        self.assertEqual(self.author1.balance(), 1500)
        self.assertEqual(self.author2.balance(), 1500)

    def test_many_authors_balanced(self):
        create_event('cookies', 3000, self.author1,
                     investors={self.author1: 1, self.author2: 1})

        self.assertEqual(self.author1.balance(), 1500)
        self.assertEqual(self.author2.balance(), 1500)

    def test_many_authors_imbalance(self):
        create_event('cookies', 6000, self.author3,
                     investors={self.author1: 2, self.author2: 1, self.author3: 3})
        self.assertEqual(self.author1.balance(), 2000)
        self.assertEqual(self.author2.balance(), 1000)
        self.assertEqual(self.author3.balance(), 3000)

    def test_many_authors_participants(self):
        create_event('cookies', 6000, self.author3,
                     participants={self.author1: 1, self.author2: 2})

        self.assertEqual(self.author1.balance(), -2000)
        self.assertEqual(self.author2.balance(), -4000)
