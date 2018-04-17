# -*- coding: utf-8 -*-

from django.contrib.auth.models import User
from django.test import TestCase

from backend.models import Event, Account, Transaction, Transfer, Participation
from backend.operations.domain.create_event import create_event
from backend.operations.domain.utils import aggregateSumm, round_up, round_down
from backend.operations.domain.account import debt
from backend.operations.domain.exceptions import OperationException


class CreateEventTest(TestCase):
    def setUp(self):
        u1 = User.objects.create(username="Author")
        u2 = User.objects.create(username="author2")
        u3 = User.objects.create(username="author3")
        u4 = User.objects.create(username='participant1')
        u5 = User.objects.create(username='participant2')

        self.author1 = Account.objects.create(user=u1, rate=1)
        self.author2 = Account.objects.create(user=u2, rate=1)
        self.author3 = Account.objects.create(user=u3, rate=1)
        self.p1 = Account.objects.create(user=u4, rate=1)
        self.p2 = Account.objects.create(user=u5, rate=1)

    def test_single_author(self):
        create_event('cookies', 3000, self.author1)
        self.assertEqual(self.author1.balance(), 3000)

    def test_many_authors_balanced(self):
        create_event('cookies', 3000, self.author1,
                     investors={self.author1: 1500, self.author2: 1500})

        self.assertEqual(self.author1.balance(), 1500)
        self.assertEqual(self.author2.balance(), 1500)

    def test_many_authors_balanced(self):
        create_event('cookies', 3000, self.author1,
                     investors={self.author1: 1500, self.author2: 1500})

        self.assertEqual(self.author1.balance(), 1500)
        self.assertEqual(self.author2.balance(), 1500)

    def test_many_authors_imbalance(self):
        create_event('cookies', 6000, self.author3,
                    investors={self.author1: 2000, self.author2: 1000, self.author3: 3000})

        self.assertEqual(self.author1.balance(), 2000)
        self.assertEqual(self.author2.balance(), 1000)
        self.assertEqual(self.author3.balance(), 3000)


    def test_many_authors_participants(self):
        create_event('cookies', 6000, self.author3,
                    investors={self.author1: 3000, self.author2: 3000},
                    participants={self.p1: 1, self.p2: 2})

        self.assertEqual(self.author1.balance(), 3000)
        self.assertEqual(self.author2.balance(), 3000)
        self.assertEqual(self.p1.balance(), -2000)
        self.assertEqual(self.p2.balance(), -4000)

    def test_investor_overhead(self):
        with self.assertRaises(OperationException):
            create_event('cookies', 6000, self.author3,
                        investors={self.author1: 4000, self.author2: 3000})

        self.assertEqual(self.author1.balance(), 0)
        self.assertEqual(self.author2.balance(), 0)
