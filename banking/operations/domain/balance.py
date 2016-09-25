from banking.models import Transaction, Transfer
from banking.operations.domain.utils import aggregateSumm


def bank_balance():
    transactionsSum = float(aggregateSumm(Transaction.objects.all()) or 0)
    transfersSumm = float(aggregateSumm(Transfer.objects.all()) or 0)
    return transactionsSum + transfersSumm
