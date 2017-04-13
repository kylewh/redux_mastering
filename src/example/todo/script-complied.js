'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var todos = function todos() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_TODO':
      return [].concat(state, [{
        id: action.id,
        text: action.text,
        completed: false
      }]);
    case 'TOGGLE_TODO':
      return state.map(function (todo) {
        if (todo.id !== action.id) {
          return todo;
        }
        return _extends({}, todo, {
          completed: !todo.completed
        });
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
