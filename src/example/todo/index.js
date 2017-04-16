const { combineReducers, createStore } = Redux
const { Component } = React
const { Provider, connect } = ReactRedux

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





let AddTodo = ({ dispatch }) => { 
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

// Container 
AddTodo = connect()(AddTodo)

// Purely presentational component
const Todo = ({ onClick, completed, text }) => (
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

const mapStateToTodoListProps = (state) => {
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
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToTodoListProps = (dispatch) => (
  { onTodoClick: id => dispatch(toggleTodo(id)) })

// Container 
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}

const mapStateToLinkProps = (
  state,
  ownProps
) => ({ active: ownProps.filter === state.visibilityFilter })

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => ({ onClick: () => dispatch(setVisibilityFilter(ownProps.filter)) })

// Container 
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>
      ALL
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_ACTIVE'>
      ACTIVE
    </FilterLink>
    {' '}
    <FilterLink filter='SHOW_COMPLETED'>
      COMPLETED
    </FilterLink>
  </p>
)

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)

ReactDOM.render(
  <Provider store={createStore(combineReducers({ todos, visibilityFilter }))}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
