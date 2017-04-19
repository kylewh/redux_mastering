import { createStore } from 'redux'
import todoApp from './reducers'
import throttle from 'lodash/throttle'


const logger = (store) => (next) => {
  if (!console.group) {
    return next
  }
  return (action) => {
    console.group(action.type)
    console.log('%c prev state', 'color: gray', store.getState())
    console.log('%c action', 'color: blue', action)
    const returnValue = next(action)
    console.log('%c next state', 'color: green', store.getState())
    console.groupEnd(action.type)
    return returnValue
  }
}

const promise = (store) =>  (next) => (mayBePromiseAction) => {
  if (typeof mayBePromiseAction.then === 'function') {
    return mayBePromiseAction.then((realAction) => next(realAction))
    // call original dispatch after promise is resolved
  }
  return next(action)
}


const wrapDispatchWithMiddlewares = (store, middlewares) => {
  middlewares.slice().reverse.forEach(middleware =>
    store.dispatch = middleware(store)(store.dispatch)
  )
}


const storeConfig = () => {
  // see http://redux.js.org/docs/api/createStore.html
  // const persistedState = loadState()
  const store = createStore(todoApp)
  const middlewares = []

  middlewares.push(promise)

  if ( process.env.NODE_ENV !== 'production') {
    middlewares.push(logger)
  }

  wrapDispatchWithMiddlewares(store, middlewares)

  return store
}

export default storeConfig
