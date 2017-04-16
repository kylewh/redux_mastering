export const addTodo = (text, id) => ({
  type: 'ADD_TODO',
  id: id,
  text
})


export const toggleTodo = (id) => ({
  type: 'TOGGLE_TODO',
  id
})


export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
