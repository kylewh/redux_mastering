'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _React = React,
    Component = _React.Component;


var nextTodoId = 0;
// Define TodoApp component

var TodoApp = function (_Component) {
  _inherits(TodoApp, _Component);

  function TodoApp() {
    _classCallCheck(this, TodoApp);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  TodoApp.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      null,
      React.createElement('input', { ref: function ref(node) {
          _this2.input = node;
        } }),
      React.createElement(
        'button',
        { onClick: function onClick() {
            store.dispatch({
              type: 'ADD_TODO',
              text: _this2.input.value,
              id: nextTodoId++
            });
            _this2.input.value = '';
          } },
        'Add Todo'
      ),
      React.createElement(
        'ul',
        null,
        this.props.todos.map(function (todo) {
          return React.createElement(
            'li',
            { key: todo.id },
            todo.text
          );
        })
      )
    );
  };

  return TodoApp;
}(Component);

var render = function render() {
  ReactDOM.render(React.createElement(TodoApp, {
    todos: store.getState().todos
  }), document.getElementById('root'));
};

render();

store.subscribe(render);
