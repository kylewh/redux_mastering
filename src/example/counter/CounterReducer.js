
/**
 * Counter Reducer
 * 
 * @param  {Object} state: previous state
 * @param  {Object} action: {type: {string}, payload: any}
 * @return {Object} nextState: a mixed new state
 */

const counter = (state = 0, action) => {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT'){
    if ( state - 1 < 0) return 0
    return state -1
  }
  return state
}

// For test using mk's expect assert library
// expect(
//   counter(0, {type: 'INCREMENT'})
// ).toEqual(1)

// expect(
//   counter(1, {type: 'INCREMENT'})
// ).toEqual(2)

// expect(
//   counter(2, {type: 'DECREMENT'})
// ).toEqual(1)

// expect(
//   counter(1, {type: 'DECREMENT'})
// ).toEqual(0)

// expect(
//   counter(1, {type: 'SOMETHINGUNKOWN'})
// ).toEqual(1)

// console.log('Test passed')


// const { createStore } = Redux


/**
 * We will re-implement createStore here
 * 
 * @param  {Function} reducer: recieve action and previous state then return a new state
 * @return {Object}  Three method included: getState, dispatch, subscribe
 */
const createStore = (reducer) => {
  let state
  let listeners = []

  /**
   * Get current state
   * @return {Object} state: current state stored in the store
   */
  const getState = () => state

  /**
   * Update current state,
   * traverse the listeners array and call every listener
   * @param {Object} action
   */
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = (listener) => {
    listeners.push(listener)
    // For later unsubscribe purpose, 
    // We return a function that actually is a array filter
    // Will remove the specified listener from the listener array 
    return () => {
      listeners = listeners.filter( l => l !== listener)
    }
  }

  dispatch({}) // Dummy action to get initial state 
  
  return { getState, dispatch, subscribe }
}

const store = createStore(counter)

/**
 * Counter Component
 * @param {Function} value: Actually is a dispatch function 
 *                   that will return the newState
 * @param {Function} onIncrement: Callback function that will 
 *                   dispatch internally an increment action
 * @param {Function} OnDecrement: The way same as above, 
 *                   but dispatch a decrement action
 * @return {ReactElement}
 */
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
)

const render = () => {
  ReactDOM.render(
    <Counter
      value={ store.getState() }
      onIncrement={() => 
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={() => 
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />, 
    document.getElementById('root')
  )
}
// subscribe receive a function, which will be called after
// everytime the dispatch is called.
// we can use it to render the reuslt to the document.

store.subscribe(render) // Very First time, no dispatch will be called.
render() // For rendering initialState we manually call render


