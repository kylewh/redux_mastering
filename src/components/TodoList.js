import React, { Component } from 'react'
import Todo from './Todo'

const TodoList = ({ todos, onTodoClick }) => {
  //console.log(onTodoClick) //you will see this function is wrapped with disptach
  return (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)}

export default TodoList
