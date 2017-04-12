/**
 * Counter Reducer
 *
 * @param {Object} state: previous state
 * @param {Object} action: {type: {string}, payload: any}
 * @return {Object} nextState: a mixed new state
 */

const counter = (state = 0, action) => {  
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT'){
    return state - 1
  }
  return state
}

//Test 
expect(
  counter(0, {type: 'INCREMENT'})
).toEqual(1)

expect(
  counter(1, {type: 'INCREMENT'})
).toEqual(2)

expect(
  counter(2, {type: 'DECREMENT'})
).toEqual(1)

expect(
  counter(1, {type: 'DECREMENT'})
).toEqual(0)

expect(
  counter(1, {type: 'SOMETHINGUNKOWN'})
).toEqual(1)

console.log('Test passed')

const { createStore } = Redux
const store = createStore(counter)


const render = () => {
  document.body.innerText = store.getState()
}
// subscribe receive a function, which will be called after
// everytime the dispatch is called.
// we can use it to render the reuslt to the document.

store.subscribe(render) // Very First time, no dispatch will be called.
render() // For rendering initialState we manually call render

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT'})
})


