from django.conf.urls import url
import frontend.views as views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    # url(r'^auth/$',                  views.auth,        name="auth"),
    # url(r'^client/$',                views.client,      name="client"),
    # url(r'^admin/$',                 views.admin,       name="admin"),
    # url(r'^error/$',                 views.error,       name="error"),

    # url(r'^events/$',                views.events,      name="events"),
    # url(r'^events/(?P<pk>[0-9]+)/$', views.eventDetail, name="event-detail"),
    # url(r'^users/$',                 views.users,       name="accounts"),
    # url(r'^users/(?P<pk>[0-9]+)/$',  views.userDetail,  name="account-detail"),
]

