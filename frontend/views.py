from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

from rest_framework.exceptions import ParseError

from backend.models import Account, Transaction, Event, Participation

import json

def index(request):
    return render(request, 'frontend/index.jade')
