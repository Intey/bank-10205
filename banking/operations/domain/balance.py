
def bank_balance():
    from banking.models import Transaction, Transfer
    from banking.operations.domain.utils import aggregateSumm

    transactionsSum = float(aggregateSumm(Transaction.objects.all()) or 0.0)
    transfersSumm = float(aggregateSumm(Transfer.objects.all()) or 0.0)
    return transactionsSum + transfersSumm
