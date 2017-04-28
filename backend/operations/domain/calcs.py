
def diff_sum(old_coef, new_coef, event_price):
    """
    No Optimize multiplify - it's can generate float errors."""
    return abs(old_coef * event_price - new_coef * event_price)
