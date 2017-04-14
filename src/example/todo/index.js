const { combineReducers, createStore } = Redux
const { Component } = React
const { connect } = ReactRedux
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
// only needed props is dispatch
// change const to let, because it doesn't have a container component for it
// itself is going to be a container 

let AddTodo = ({ dispatch }) => { 
  let input
  return(
    <div>
      <input ref={node => {
        input = node
      }} />
      <button onClick={() => {
        dispatch({
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

// It's pretty common pattern to inject just the dispatch function. 
// This is why if you specify null or any false value in connect 
// as the second argument, you're going to get dispatch injected as a prop. 

// The default behavior will be to not subscribe to this store 
// and to inject just the dispatch function as a prop.
AddTodo = connect()(AddTodo)


// **KEEP IN YOUR MIND**
// IF YOU DON'T SPECIFY THE CONTEXTTYPES
// YOU **WON'T** RECEIVE CONTEXT

// we will use context from Provider so we have to do this.
// AddTodo.contextTypes = {
//   store: React.PropTypes.object
// }


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
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    ),
  }
}

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: id => {
      dispatch({
        type: 'TOGGLE_TODO',
        id
      })
    }
  }
}


// connect is a **CURRIED** function so the return value is a function.
// using connect, we won't need to specify the contextTypes
// connect do it for us. => @TODO I really wanna more details about it, may be later.
// we can use it to generate container function
// container => receive state


// One thing to remind: 
// Although connect is a curried function, but the amount of argument in connect
// is fixed
// Passing in mapStateToProps or mapDispatchToProps or both of it is totally up to you
// Sometime our container may need to hanlde some event wrapped with dispatch
// so we do mapDispatchToProps
// Sometime we just want to pass in state
// then we do mapStateToProps, it's clear :)
// Connect will calculate the props to pass through the presentational component by merging
// the objects returned from mapStateToProps, mapDispatchToProps, and its own props.
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

// TodoList is the target to wrap and pass the props to

// using connect generate VisibleTodoList container for us ,
// we don't need to write manually

// so in the container , we did three things

// 1. receive store from Provider, which is the center we store all state
// 2. subscribe a force update function to store
// 3. unsubscribe when component will unmount


// class VisibleTodoList extends Component {
//   componentDidMount() {
//     const { store } = this.context
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     )
//   }
//   componentWillUnMount() {
//     this.unsubscribe()
//   }
//   render () {
//     const { store } = this.context
//     const state = store.getState()
//     return (
//       <TodoList
//       />
//     )
//   }
// }

// we will use context from Provider so we have to do this.
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// }

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
const todoApp = combineReducers({ todos, visibilityFilter })
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
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
