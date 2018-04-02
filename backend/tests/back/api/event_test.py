# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APIClient

from backend.models import Account, Event, Participation, Transaction


class EventAPITest(TestCase):
    def setUp(self):
        self.factory = APIClient()
        a = User.objects.create(username="Author")
        self.author = Account.objects.create(user=a, rate=1.0)

        u1 = User.objects.create(username="P0")
        u2 = User.objects.create(username="P1")
        u3 = User.objects.create(username="P2")
        u4 = User.objects.create(username="P3")
        u5 = User.objects.create(username="P4")
        u6 = User.objects.create(username="P5")
        self.acc1 = Account.objects.create(user=u1)
        self.acc2 = Account.objects.create(user=u2)
        self.acc3 = Account.objects.create(user=u3)
        self.acc4 = Account.objects.create(user=u4)
        self.acc5 = Account.objects.create(user=u5)
        self.acc6 = Account.objects.create(user=u6)

    def test_create_event(self):
        response = self.factory.post('/api/events/',
                                     {
                                         'name': 'Event',
                                         'date': '2016-01-22',
                                         'price': 3000,
                                         'author': self.author.id,
                                     }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event_id = response.data['id']
        created_event = Event.objects.get(id=event_id)
        self.assertEqual(created_event.price, 3000)

    def test_event_with_participants(self):
        response = self.factory.post('/api/events/',
                                     {
                                         'name': 'Event Particpants',
                                         'date': '2016-01-22',
                                         'price': 3000,
                                         'author': self.author.id,
                                         'participants': [
                                             {"account": self.acc1.id,
                                              "parts": 1.0},
                                             {"account": self.acc2.id,
                                              "parts": 2.0}],
                                     }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event_id = response.data['id']
        created_event = Event.objects.get(id=event_id)

        p_count = len(Participation.objects.filter(event=created_event))
        self.assertEqual(p_count, 2)

    def test_author_get_money_for_event(self):
        response = self.factory.post('/api/events/',
                                     {
                                         'name': 'Event Particpants',
                                         'date': '2016-01-22',
                                         'price': 3000,
                                         'author': self.author.id
                                     },
                                     format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_event = Event.objects.get(id=response.data['id'])

        author = created_event.author
        self.assertEqual(author.balance(), 3000)

    def test_many_authors(self):
        response = self.factory.post('/api/events/',
                                     {
                                         'name': 'Event Particpants',
                                         'date': '2016-01-22',
                                         'price': 3000,
                                         'author': self.author.id,
                                         'investors': [
                                             {
                                                 "account": self.acc2.id,
                                                 "summ": 1000
                                             },
                                             {
                                                 "account": self.acc3.id,
                                                 "summ": 2000
                                             }
                                         ]
                                     },
                                     format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_event = Event.objects.get(id=response.data['id'])
        investors = created_event.investors.all()
        self.assertEqual(len(investors), 2)
        self.assertEqual(investors[0].balance(), 1000)
        self.assertEqual(investors[1].balance(), 2000)

    def test_investor_overhead(self):
        investor = self.acc2
        response = self.factory.post('/api/events/',
                                     {
                                         'name': 'Event Particpants',
                                         'date': '2016-01-22',
                                         'price': 3000,
                                         'author': self.author.id,
                                         'investors': [
                                             {
                                                 "account": investor.id,
                                                 "summ": 4000
                                             }
                                         ]
                                     },
                                     format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(investor.balance(), 0)  # no changes
