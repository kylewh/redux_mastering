/**
 * Reducers
 *  todo
 *  todos
 *  visibilityFilter
 */
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state
      }
			return {
				...state,
				completed: !state.completed
			}
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action) 
        // Notice that when action.type is 'ADD_TODO'
        // We only need data from action, so we can just pass undefine into todo
      ]
    case 'TOGGLE_TODO':
      return state.map( t => todo(t, action))
    default: 
      return state
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}
/**** reducers end ****/

const { combineReducers } = Redux
const { createStore } = Redux
const { Component } = React

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const store = createStore(todoApp)

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

let nextTodoId = 0

/**
 * Compenents
 *  Todo
 *    @param {Function} onClick
 *                      Dispatch 'TOGGLE_TODO' action
 *    @param {Boolean}  completed
 *                      When todo was clicked, toggle action will invert its state
 *    @param {String}   text
 *                      Content of todoItem, from AddTodo's loacal variable 'input'
 *                      input refers to input element by using ref={node => input = node}
 * 
 *  TodoList
 *    @param {Array}    todos
 *                      Todos array, but was filtered by visibilityFilter
 *    @param {Function} onTodoClick
 *                      Passed to Todo as @param {Function} onClick
 *                      
 *  AddTodo
 *    @param {Function} onAddClick
 *                      Dispatch 'ADD_TODO' action
 * 
 *  FilterLink
 *    @param {String}   filter
 *                      Specify the state of visibilityFilter
 *    @param {String}   currentFilter
 *                      Passed from Footer @param {String} visibilityFilter
 *    @param {Function} onClick
 *                      @param {String} filter => @param {String} filter
 *                      Dispatch 'SET_VISIBILITY_FILTER' action
 * 
 *  Footer
 *    @param {String}   visibilityFilter
 *                      Passed from @param {String} visibilityFilter
 *                       
 *    @param {Function} onFilterClick
 *                      Passed to FilterLink @param {Function} onClick
 *                      Dispatch 'SET_VISIBILITY_FILTER' action
 *  TodoApp
 *    @param {Array}    todos
 *                      store.getState().todos
 *    @param {String}   visibilityFilter
 *                      store.getState().visibilityFilter
 */

// Purely presentational component
const Todo = ({onClick, completed, text}) => (
  <li
    style={{
      textDecoration: completed ? 'line-through' : 'none',
      cursor: 'pointer'
    }}
    onClick={onClick}>
    {text}
  </li>
)

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo => 
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

const AddTodo = ({onAddClick}) => {
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button onClick={() => {
        onAddClick(input.value)
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>)
}

const FilterLink = ({filter, currentFilter, children, onClick}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault()
        onClick(filter)
      }}
    >
      {children}
    </a>
  )
}

const Footer = ({ visibilityFilter, onFilterClick }) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      ALL
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      ACTIVE
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
      currentFilter={visibilityFilter}
      onClick={onFilterClick}
    >
      COMPLETED
    </FilterLink>
  </p>
)

const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
    <AddTodo
      onAddClick={text => 
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text
        })
      }
    />
    <TodoList
      todos={
        getVisibleTodos(
          todos,
          visibilityFilter
        )
      }
      onTodoClick={id =>
        store.dispatch({
          type:'TOGGLE_TODO',
          id
        })
      }
    />
    <Footer
      visibilityFilter={visibilityFilter}
      onFilterClick={filter =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }
    />
  </div>
)


/*** Compenents end ***/

const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />
    ,
    document.getElementById('root')
  )
}

render()

store.subscribe(render)
