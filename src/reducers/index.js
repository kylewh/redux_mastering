import { combineReducers } from 'redux'
import todos, * as fromTodos from './todos'

const todoApp = combineReducers({
  todos
})

export default todoApp

export const getVisibleTodos = (state, filter) =>
  fromTodos.getVisibleTodos(state.todos, filter)
  // we specify target state: todos here.
  // once the data-structure changed we can specify it again
  