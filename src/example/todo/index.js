// Reducer composition => separate the reducer as possible
// It will make your reducer logic clear and enhance the reuseability
// Micro reducer: only deal with state of single todo item,
// that's why we extract this logic from the previous reducer with obscure logic
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

// If we want to add more information such as an filter into the state,
// we need to create another reducer and mix the two reducer into one
// Let's go

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

// You may notice, initially state.todos is undefined,
// as the previous example when we implement createStore,
// we know once an action is dispatched, the state will --
// be updated by getting a new state returned from reducer call.
// so after one dispatch, the state will have the key todos & visibilityFilter

// By implement a combined reducer by hand, 
// redux offered an api called combineReducers

// const todoApp = (state={}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   }
// }

const Todo = ({content, status}) => {
  return (
    <div style={{border: '1px solid #ccc', display: 'inline-block', padding: 10, margin: 10}} >
      <p style={{margin: 0}}>{`content: ${content}`}</p>
      <p style={{margin: 0}}>{`status: ${status}`}</p>
    </div>
  )
}

// const { combineReducers } = Redux

// In order to fully understand what's combineReducers do
// Let's try to implement it

/**
 * combineReducers is a reducer
 * @param  {Object}   reducers: { reducer1: reducer1, reducer2: reducer2 }
 * @return {function} mixed reducer
 */
const combineReducers = (reducers) => {
  return (state ={}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => { // When gave an initial value(here is {}), nextState will be {}
        nextState[key] = reducers[key](state[key], action)
        // This is actually very similar to 'todos: todos(state.todos, action)'
        return nextState
      },
      {} //initial value => offered a container for mixed state
    )
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
}) //ES6 syntax suugar => { todos: todos, visibilityFilter: visibilityFilter }

const { createStore } = Redux

const store = createStore(todoApp) // change todo to todoApp

const render = () => {
  ReactDOM.render(
    <div>
      {store.getState().todos.map( todo => {
        let status = todo.completed ? 'yes' : 'no'
        return (
          <div key={todo.id}>
            <Todo
              content={todo.text}
              status={status}
            />
          </div>
        )
      })}
      <p>{`Filter: ${store.getState().visibilityFilter}`}</p>
    </div>
    ,
    document.getElementById('root')
  )
}

render()

store.subscribe(render)

store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
})

store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Learn React-router'
})

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1
})

store.dispatch({
  type: 'ADD_TODO',
  id: 2,
  text: 'Learn React-routerv4'
})

