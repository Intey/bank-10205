# -*- coding: utf-8 -*-

from django.test import TestCase

from backend.operations.domain.utils import round_up, round_down


def get_in(key_string, d):
    keys = key_string.split('.')
    res = d
    for k in keys:
        if not isinstance(res, dict): return None
        res = res.get(k, None)
    return res


class GetInTest(TestCase):
    def setUp(self):
        self.data = {'a': {'b': {'e': 45}}}
        self.wrong_data = {'a': {'b': 45}}

    def getin_test(self):
        print(get_in('a.b.e', self.data))
        self.assertEqual(get_in('a.b.e', self.data), 45)

    def getin_wrong_path_test(self):
        self.assertEqual(get_in('a.b.c', self.wrong_data), None)


class RoundTest(TestCase):

    def up_test(self):
        self.assertEqual(0.0, round_up(0.00000))
        self.assertEqual(1e-05, round_up(0.00001))
        self.assertEqual(15.1112, round_up(15.11112))
        self.assertEqual(15.1112, round_up(15.11115))

    def precision_test(self):
        self.assertEqual(3333.4, round_up(3333.3334, 1))

    def up_far_test(self):
        self.assertEqual(3333.3331, round_up(3333.3330001))
        self.assertEqual(3333.3331, round_up(3333.333099999))

    def save_up_test(self):
        self.assertEqual(3333.3334, round_up(3333.3334))
