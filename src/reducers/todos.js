import { combineReducers } from 'redux'
import todo from './todo'

/**
 * id: todoObject 
 *      {
  *      id: id,
  *      completed: completed,
  *      text: text
 *      }
 */
const byId = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
    case 'TOGGLE_TODO':
      return {
        ...state,
        [action.id]: todo(state[action.id], action),
      };
    default:
      return state
  }
}

/**
 * allIds : [id ... ]
 */
const allIds = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.id]
    default:
      return state;
  }
}

const todos = combineReducers({
  byId,
  allIds,
})

export default todos;

const getAllTodos = (state) =>
  state.allIds.map(id => state.byId[id])

export const getVisibleTodos = (state, filter) => {
  const allTodos = getAllTodos(state);
  switch (filter) {
    case 'all':
      return allTodos;
    case 'completed':
      return allTodos.filter(t => t.completed)
    case 'active':
      return allTodos.filter(t => !t.completed)
    default:
      throw new Error(`Unknown filter: ${filter}.`)
  }
}
