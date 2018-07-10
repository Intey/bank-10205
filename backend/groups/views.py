# from django.http import Http404
# from django.shortcuts import get_object_or_404

# from rest_framework import views, status, generics, filters
from rest_framework import generics
# from rest_framework.response import Response

from backend.models import Group

from .serializers import GroupSerializer


class GroupListView(generics.ListCreateAPIView):
    """ Show groups of users. """
    model = Group
    serializer_class = GroupSerializer
    queryset = Group.objects.all()
