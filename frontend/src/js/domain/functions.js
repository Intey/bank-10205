
/**
 * Calculate debt on given event price and parts of account.
 * @param {Float} eventPrice price of event, on which calculating debt
 * @param {Float} summaryParts all parts of all participants. With it
 * calculated part price.
 * @param {Float} parts for which count of parts debt is calculate.
 */
export function calcDebt(eventPrice, summaryParts, parts) {
    return parts * (eventPrice / summaryParts)
}

export function reshapeAccount(account) {
  return {
    firstName: account.user.first_name,
    lastName: account.user.last_name,
    username: account.user.username,
    id: account.id
  }
}
