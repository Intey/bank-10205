from rest_framework.views import APIView
from rest_framework import generics

from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ParseError
from rest_framework import status

from django.contrib.auth.models import User

from banking.models import Account
from banking.views import has_permisions
from banking.serializers.user import UserSerializer, AccountSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from django.http import JsonResponse, HttpResponse

import urllib

from django.db.models import Q


class auth(APIView):
    def post(self, request, format=None):
        try:
            data = request.data
        except ParseError as error:
            return Response(
                'Invalid JSON - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'username' not in data or 'password' not in data:
            return Response(
                'Wrong credentials',
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            return Response("User not exists",
                            status=status.HTTP_404_NOT_FOUND)

        if not user or not user.check_password(data['password']):
            return Response(
                'No default user, please create one',
                status=status.HTTP_404_NOT_FOUND
            )

        token = Token.objects.get_or_create(user=user)
        return Response({
            'token': token[0].key,
            'user': UserSerializer(user).data
        })

    def delete(self, request, format=None):
        try:
            key = request.META.get('HTTP_AUTHORIZATION').split()[1]
        except ParseError as error:
            return Response(
                'Invalid HTTP request - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        token = Token.objects.get(key=key)
        if not token:
            return Response(
                'User was not authorized',
                status=status.HTTP_404_NOT_FOUND
            )
        token.delete()
        return Response({
            'detail': 'Token has been deleted'
        })


class user(APIView):
    authentication_classes = (
        TokenAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
    )

    def get(self, request, pk=None, pattern=None, format=None):
        key = request.META.get('HTTP_AUTHORIZATION')
        if key is None:
            return Response(
                'Invalid HTTP request - {0}',
                status=status.HTTP_400_BAD_REQUEST
            )
        key = key.split()[1]
        user = None
        if pk:
            user = User.objects.get(pk=pk)
        elif pattern:
            pattern = urllib.unquote(pattern)

            query = Q(username__startswith=pattern) |\
                Q(first_name__startswith=pattern) |\
                Q(last_name__startswith=pattern)

            users = User.objects.filter(query).distinct()
            users = UserSerializer(users, many=True)

            return Response(users.data)
        else:
            user = User.objects.get(auth_token=key)

        user = UserSerializer(user)
        return Response(user.data)

    def post(self, request, format=None):
        try:
            data = request.data
        except ParseError as error:
            return Response(
                'Invalid JSON - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'username' not in data or 'password' not in data or \
           'first_name' not in data or 'last_name' not in data or \
           'is_superuser' not in data:
            return Response(
                'Wrong credentials',
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            if not has_permisions(request):
                return HttpResponse(
                    'You do not have permission',
                    status=status.HTTP_403_FORBIDDEN
                )
        except ParseError:
            return HttpResponse(
                'Invalid HTTP request - {0}',
                status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(
            username=data['username'],
            password=data['password']
        )
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.is_superuser =  False if data['is_superuser']=='false' else True
        user.is_staff = False if data['is_superuser']=='false' else True

        acc = Account(user=user)  # by default rate field get '1.0' value
        if 'rate' in data:
            acc.rate = data['rate']

        user.save()
        acc.save()
        return HttpResponse(status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        try:
            data = request.data
        except ParseError as error:
            return Response(
                'Invalid JSON - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'username' not in data or 'password' not in data or \
           'first_name' not in data or 'last_name' not in data or \
           'is_superuser' not in data:
            return Response(
                'Wrong credentials',
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            if not has_permisions(request):
                return HttpResponse(
                    'You do not have permission',
                    status=status.HTTP_403_FORBIDDEN
                )
        except ParseError:
            return HttpResponse(
                'Invalid HTTP request - {0}',
                status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.get(pk=pk)
        user.username = data['username']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.is_superuser =  False if data['is_superuser']=='false' else True
        user.is_staff = False if data['is_superuser']=='false' else True
        if data['password']:
            user.set_password(data['password']);
        user.save()
        return HttpResponse(status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        try:
            if not has_permisions(request):
                return HttpResponse(
                    'You do not have permission',
                    status=status.HTTP_403_FORBIDDEN
                )
        except ParseError:
            return HttpResponse(
                'Invalid HTTP request - {0}',
                status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.get(pk=pk)
        user.delete()
        return HttpResponse(status=status.HTTP_200_OK)


class UserList(generics.ListCreateAPIView):
    authentication_classes = (
        TokenAuthentication,
    )
    # permission_classes = (
    #     IsAuthenticated,
    # )

    model = Account
    serializer_class = AccountSerializer
    queryset = Account.objects.all()


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Account
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
