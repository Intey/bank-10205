"""
Django settings for bankdjangoreact project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import json
import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ## Load setting from 'BANK' Environment variable.
# ## Scheme:
#   - {'dev': bool, 'apps': array()}
# ## Variants:
#   - 'apps': 'any valid apps, that can be added to INSTALLED_APPS

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

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '8a16=nu((q05jgxwea*q+1-_*96fh!%0(y&x$qwptdt6x85i7m'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    '*',
]


# Application definition


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    'backend',
]
if BANK_SETTINGS['dev']: # cross-port access to api
    INSTALLED_APPS.append('corsheaders')
    apps = BANK_SETTINGS.get('apps', [])
    if len(apps) > 0:
        INSTALLED_APPS += apps
MIDDLEWARE_CLASSES = [
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
if BANK_SETTINGS['dev']:
    # corsheaders should be high
    MIDDLEWARE_CLASSES = ['corsheaders.middleware.CorsMiddleware'] \
            + MIDDLEWARE_CLASSES

ROOT_URLCONF = 'bank.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# TEMPLATES = [
#     {
#         'NAME': 'html',
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         # 'APP_DIRS': True,  # 'couze set loaders
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#             'loaders': [
#                 ('pyjade.ext.django.Loader', (
#                     'django.template.loaders.filesystem.Loader',
#                     'django.template.loaders.app_directories.Loader',
#                 ))
#             ],
#             # 'builtins': ['pyjade.ext.django.templatetags'],
#         },
#     },
# ]

WSGI_APPLICATION = 'bank.wsgi.application'

# Database
DATABASES = {'default': dj_database_url.config()}
if BANK_SETTINGS.get('dev') or BANK_SETTINGS.get('db') == "sqlite":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = 'staticfiles'
if not BANK_SETTINGS.get('dev'):
    STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

REST_FRAMEWORK = {
    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    # ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

MIGRATION_MODULES = {
    'backend': 'backend.migrations'
}

TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

if BANK_SETTINGS['dev']:
    CORS_ORIGIN_ALLOW_ALL = True
