from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^', include('frontend.urls')),
    url(r'^backdoor/', include(admin.site.urls)),
    url(r'^api/', include('backend.urls')),
]
