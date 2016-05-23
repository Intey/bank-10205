"""
WSGI config for bankdjangoreact project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
import json
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bank.settings")

application = get_wsgi_application()

BANK_SETTINGS = {'dev': False, 'apps': [], 'db': ""}
BANK_ENV = os.getenv("BANK")
if BANK_ENV:
    BANK_ENV = BANK_ENV.replace("'", '"')  # json.loads expect " instead '
    try:
        temp = json.loads(BANK_ENV)
        BANK_SETTINGS.update(temp)
    except json.decoder.JSONDecodeError as e:
        print("Failed load settings from BANK ENV VAR. Error:", e)
del BANK_ENV

if not BANK_SETTINGS.get('dev'):
    from whitenoise.django import DjangoWhiteNoise
    application = DjangoWhiteNoise(application)
