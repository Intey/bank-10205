from django.conf.urls import url

from .views import balance


urlpatterns = [
    url(r'^$', balance, name='api-balance'),
]
