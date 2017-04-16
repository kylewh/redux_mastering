import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

const AddTodo = ({ dispatch }) => { 
  let input,
      nextTodoId = 0
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button onClick={() => {
        dispatch(addTodo(input.value, nextTodoId++))
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>)
}

export default connect()(AddTodo)
