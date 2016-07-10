

def deNone(value, default):
    """ Try to get value, but if it is None - return 'default'."""
    return default if value is None else value
