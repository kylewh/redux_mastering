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

const Todo = ({content, status}) => {
  return (
    <div style={{border: '1px solid #ccc', display: 'inline-block', padding: 10, margin: 10}} >
      <p style={{margin: 0}}>{`content: ${content}`}</p>
      <p style={{margin: 0}}>{`status: ${status}`}</p>
    </div>
  )
}

const { createStore } = Redux

const store = createStore(todos)

const render = () => {
  ReactDOM.render(
    <div>
      {store.getState().map( todo => {
        let status = todo.completed ? 'yes' : 'no'
        return (
          <div>
            <Todo
              key={todo.id}
              content={todo.text}
              status={status}
            />
          </div>
        )
      })}
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



