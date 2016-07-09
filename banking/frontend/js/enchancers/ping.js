/*eslint-disable */
export const ping = store => next => action => {
    console.log('action:' + JSON.stringify(action))
    return next(action)

}
/*eslint-disable */
