from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

from rest_framework.exceptions import ParseError

from backend.api.user.serializers import UserSerializer, AccountSerializer
from backend.api.event.serializers import EventSerializer
from backend.api.transaction.serializers import TransactionReadViewSerializer
from backend.models import Account, Transaction, Event, Participation

import json

def default(request):
    return render(request, 'backend/redirect.jade')


def auth(request):
    title = 'Bank::Authentication'
    return render(request, 'backend/auth.jade', dict(title=title))


def client(request):
    title = 'Bank::Client Application'
    return render(request, 'backend/client/index.jade', dict(title=title))


def admin(request):
    title = 'Bank::Admin'
    return render(request, 'backend/admin/index.jade', dict(title=title))


def events(request):
    title = 'Bank::Events'
    return render(request, 'backend/events.jade', dict(title=title))


def users(request):
    title = 'Bank::Users'
    return render(request, 'backend/users.jade', dict(title=title))


def userDetail(request, pk):
    context = dict()
    acc = get_object_or_404(Account, pk=pk)
    print(acc)
    context['account'] = acc
    context['transactions'] = json.dumps(TransactionReadViewSerializer(
        Transaction.objects.filter(participation__account=acc),
        many=True).data)

    context['user'] = acc.user

    return render(request, 'backend/user.jade', context)


def eventDetail(request, pk):
    event = get_object_or_404(Event, pk=pk)
    context = dict()
    # serialize to json, then in template, we can parse and save it in variable
    # serialization there needs, because JS don't know how to parse python
    # primitives: True/False is error symbols.
    # So, create model serialization and dumps to JSON.
    context['event'] = json.dumps(EventSerializer(event).data)
    context['id'] = event.id
    context['users'] = json.dumps(AccountSerializer(Account.objects.all(), many=True).data)
    context['participants'] = Participation.objects.filter(event=event)
    return render(request, 'backend/event.jade', context)


def error(request):
    title = 'Bank::Error'
    return render(request, 'backend/error.jade', dict(title=title))


def has_permisions(request):
    """ Checks that user with token is admin.  """
    key = request.META.get('HTTP_AUTHORIZATION')
    if key is None:
        raise ParseError
    key = key.split()[1]
    user = User.objects.get(auth_token=key)
    if user and UserSerializer(user).data['is_superuser']:
        return True
    return False
