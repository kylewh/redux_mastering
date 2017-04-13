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

// If we want to add more information such as an filter into the state,
// we need to create another reducer and mix the two reducer into one
// Let's go

var visibilityFilter = function visibilityFilter() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SHOW_ALL';
  var action = arguments[1];

  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

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

// const { combineReducers } = Redux

// In order to fully understand what's combineReducers do
// Let's try to implement it

/**
 * combineReducers is a reducer
 * @param  {Object}   reducers: { reducer1: reducer1, reducer2: reducer2 }
 * @return {function} mixed reducer
 */
var combineReducers = function combineReducers(reducers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    return Object.keys(reducers).reduce(function (nextState, key) {
      // When gave an initial value(here is {}), nextState will be {}
      nextState[key] = reducers[key](state[key], action);
      // This is actually very similar to 'todos: todos(state.todos, action)'
      return nextState;
    }, {} //initial value => offered a container for mixed state
    );
  };
};

var todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
}); //ES6 syntax suugar => { todos: todos, visibilityFilter: visibilityFilter }

var _Redux = Redux,
    createStore = _Redux.createStore;


var store = createStore(todoApp); // change todo to todoApp

var render = function render() {
  ReactDOM.render(React.createElement(
    'div',
    null,
    store.getState().todos.map(function (todo) {
      var status = todo.completed ? 'yes' : 'no';
      return React.createElement(
        'div',
        { key: todo.id },
        React.createElement(Todo, {
          content: todo.text,
          status: status
        })
      );
    }),
    React.createElement(
      'p',
      null,
      'Filter: ' + store.getState().visibilityFilter
    )
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
