from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError

from backend.models import Account
from backend.api.user.serializers import AccountSerializer


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
                'does-not exist fields in request username or password',
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            return Response("Wrong credentials",
                            status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(data['password']):
            return Response(
                'Username or password is invalid',
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = Token.objects.get_or_create(user=user)
        acc = Account.objects.filter(user=user)[0]
        return Response({
            'token': token[0].key,
            'account': AccountSerializer(acc).data
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
