import React from 'react'
import Counter from '../reducer/reducer-counter'

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

// Test 
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

