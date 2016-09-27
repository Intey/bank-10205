

def deNone(value, default):
    """ Try to get value, but if it is None - return 'default'."""
    return default if value is None else value


def __flushModels():
    from banking.models import Transfer, Transaction, Event
    Event.objects.all().delete()
    Transaction.objects.all().delete()
    Transfer.objects.all().delete()
