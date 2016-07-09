import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' // for async server requests

import rootReducer from '../reducers'
import { ping } from '../enchancers/ping.js'

export default function configureStore(inital) {
    const store = createStore(
        rootReducer,
        inital,
        applyMiddleware(thunk, ping),
    )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replacereduce(nextRootReducer)
    })
  }
  return store
}
