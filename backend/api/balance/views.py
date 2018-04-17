
from rest_framework.decorators import api_view
from rest_framework.response import Response

from backend.operations.domain.balance import bank_balance


@api_view(['GET'])
def balance(req):
    balance = bank_balance()
    return Response({'balance': balance})
