import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

export default function configureStore(inital) {
  const store = createStore(rootReducer, inital)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replacereduce(nextRootReducer)
    })
  }
  return store
}
