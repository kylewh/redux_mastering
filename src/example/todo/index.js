const { combineReducers, createStore } = Redux
const { Component } = React
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

// we can remove it and pass it as props into the <todoApp />
// const todoApp = combineReducers({ todos, visibilityFilter })
// const store = createStore(todoApp)

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
// It either as a presentational components or 
// as a container components because it doesn't fit either category
// The input and the button are the presentational part,
// but dispatching an action onClick is the behavior 
// which is usually specified by the container.

// Functional Component
// The second argument is context
const AddTodo = (props, { store }) => {
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = ''
      }}>
        Add Todo
      </button>
    </div>)
}
// **KEEP IN YOUR MIND**
// IF YOU DON'T SPECIFY THE CONTEXTTYPES
// YOU **WON'T** RECEIVE CONTEXT

// we will use context from Provider so we have to do this.
AddTodo.contextTypes = {
  store: React.PropTypes.object
}

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

/**
 * Top level - Container components
 * VisibleTodoList
 *     ---TodoList
 *         ---Todo
 */
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }
  componentWillUnMount() {
    this.unsubscribe()
  }
  render () {
    const { store } = this.context
    const state = store.getState()
    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })}
      />
    )
  }
}
// we will use context from Provider so we have to do this.
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}

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

// Container Component 
// provide data and behavior for the presentational component

/**
 * Secondary Top level - Container components
 * FilterLink
 *    ---Link
 */
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    )
  }
  componentWillUnMount() {
    this.unsubscribe()
  }
  render() {
    const { store } = this.context
    const props = this.props
    const state = store.getState()
    return (
      <Link
        active={props.filter === state.visibilityFilter}
        onClick={() => 
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })}
      >
        {props.children}
      </Link>
    )
  }
}
// we will use context from Provider so we have to do this.
FilterLink.contextTypes = {
  store: React.PropTypes.object
}

// presentational Compenents
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      ALL
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      ACTIVE
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      COMPLETED
    </FilterLink>
  </p>
)

const TodoApp = ({store}) => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
/*** Compenents end ***/

// This time we use Provider offered by React-Redux
const { Provider } = ReactRedux

ReactDOM.render(
  <Provider store={createStore(combineReducers({todos,visibilityFilter}))}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)


/**
 * So we can notice context's mechanism is implicitly pass down the data.
 * It's powerful.
 * But's gloabal variable (Its nature) is not that good
 * Unless you're using it for dependency injection, 
 * like here when we need to make a single object available to all 
 * components, then probably you shouldn't use context.
 */
