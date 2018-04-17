import json

from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.exceptions import ParseError

from backend.api.user.serializers import UserSerializer, AccountSerializer
from backend.models import Account, Transaction, Event, Participation


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
