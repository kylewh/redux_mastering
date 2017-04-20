import { combineReducers } from 'redux'
import byId, * as fromById from './byId'
import createList, * as fromList from './createList'

const listByFilters = combineReducers({
  all: createList('all'),
  active: createList('active'),
  completed: createList('completed')
})

const todos = combineReducers({
  byId,
  listByFilters,
})

export default todos;

// const getAllTodos = (state) =>
//   state.allIds.map(id => state.byId[id])


// selector: This is a function that you write. 
// It specifies what parts of the state a component
// needs as properties.
export const getVisibleTodos = (state, filter) => {
  const ids = fromList.getIds(state.listByFilters[filter])
  return ids.map(id => fromById.getTodo(state.byId, id))
}

export const getIsFetching = (state, filter) => {
  return fromList.getIsFetching(state.listByFilters[filter])
}

export const getErrorMessage = (state, filter) => {
  return fromList.getErrorMessage(state.listByFilters[filter])
}
