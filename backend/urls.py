from django.conf.urls import url, include

from backend import views
from bank import settings

urlpatterns = [
    url(r'^events/',       include('backend.api.event.urls')),
    url(r'^transactions/', include('backend.api.transaction.urls')),
    url(r'^users/',        include('backend.api.user.urls')),
    url(r'^auth/',         include('backend.api.auth.urls')),
    url(r'^balance/',      include('backend.api.balance.urls')),
]
# API docs. Uncomment 'rest_framework_swagger' in apps, and install
# package. By the way, it's need more work, to become nice.
if 'rest_framework_swagger' in settings.INSTALLED_APPS:
    urlpatterns += url(r'^docs/', include('rest_framework_swagger.urls')),
