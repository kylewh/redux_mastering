import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import { createLogger } from 'redux-logger'
import todoApp from './reducers'
import throttle from 'lodash/throttle'
import thunk from 'redux-thunk'

// const thunk = (store) => (next) => (action) => 
//   typeof action === 'function' ?
//     action(store.disptach, store.getState) :
//     next(action)


const storeConfig = () => {
  // see http://redux.js.org/docs/api/createStore.html
  // const persistedState = loadState()

  const middlewares = [thunk]

  middlewares.push(promise)

  if ( process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger())
  }

  return createStore(
    todoApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(...middlewares)
  )
}

export default storeConfig
