from django.conf.urls import url, include

from backend import views
from bank import settings

from backend.groups.views import GroupListView

urlpatterns = [
    url(r'^$', GroupListView.as_view(), name='api-groups'),
]
