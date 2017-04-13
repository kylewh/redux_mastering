'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Reducer composition => separate the reducer as possible
// It will make your reducer logic clear and enhance the reuseability
// Micro reducer: only deal with state of single todo item,
// that's why we extract this logic from the previous reducer with obscure logic
var todo = function todo(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return _extends({}, state, {
        completed: !state.completed
      });
  }
};

var todos = function todos() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_TODO':
      return [].concat(state, [todo(undefined, action)
      // Notice that when action.type is 'ADD_TODO'
      // We only need data from action, so we can just pass undefine into todo
      ]);
    case 'TOGGLE_TODO':
      return state.map(function (t) {
        return todo(t, action);
      });
    default:
      return state;
  }
};

var Todo = function Todo(_ref) {
  var content = _ref.content,
      status = _ref.status;

  return React.createElement(
    'div',
    { style: { border: '1px solid #ccc', display: 'inline-block', padding: 10, margin: 10 } },
    React.createElement(
      'p',
      { style: { margin: 0 } },
      'content: ' + content
    ),
    React.createElement(
      'p',
      { style: { margin: 0 } },
      'status: ' + status
    )
  );
};

var _Redux = Redux,
    createStore = _Redux.createStore;


var store = createStore(todos);

var render = function render() {
  ReactDOM.render(React.createElement(
    'div',
    null,
    store.getState().map(function (todo) {
      var status = todo.completed ? 'yes' : 'no';
      return React.createElement(
        'div',
        null,
        React.createElement(Todo, {
          key: todo.id,
          content: todo.text,
          status: status
        })
      );
    })
  ), document.getElementById('root'));
};

render();

store.subscribe(render);

store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});

store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Learn React-router'
});

store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1
});

store.dispatch({
  type: 'ADD_TODO',
  id: 2,
  text: 'Learn React-routerv4'
});
