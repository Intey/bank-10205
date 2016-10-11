/*eslint-disable */
export const log = store => next => action => {
    console.log('action:' + JSON.stringify(action))
    return next(action)

}
/*eslint-disable */
