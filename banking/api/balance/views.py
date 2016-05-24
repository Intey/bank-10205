
from rest_framework.decorators import api_view
from rest_framework.response import Response

from banking.models import Transaction
from banking.operations.domain.utils import sumQuery


@api_view(['GET'])
def balance(req):
    balance = float(Transaction.objects.all().aggregate(**sumQuery('b'))['b']
                    or 0)
    return Response({'balance': balance})
