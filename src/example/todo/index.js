const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map( todo => {
        if (todo.id !== action.id) {
          return todo
        }
        return {
          ...todo,
          completed: !todo.completed
        }
      })
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




