'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Reducers
 *  todo
 *  todos
 *  visibilityFilter
 */
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

/**** reducers end ****/
var _Redux = Redux,
    combineReducers = _Redux.combineReducers;
var _Redux2 = Redux,
    createStore = _Redux2.createStore;
var _React = React,
    Component = _React.Component;


var todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});

var store = createStore(todoApp);

var getVisibleTodos = function getVisibleTodos(todos, filter) {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(function (t) {
        return t.completed;
      });
    case 'SHOW_ACTIVE':
      return todos.filter(function (t) {
        return !t.completed;
      });
  }
};

var nextTodoId = 0;

/**
 * Compenents
 *  FilterLink
 *  TodoApp
 */

var FilterLink = function FilterLink(_ref) {
  var filter = _ref.filter,
      currentFilter = _ref.currentFilter,
      children = _ref.children;

  if (filter === currentFilter) {
    return React.createElement(
      'span',
      null,
      children
    );
  }
  return React.createElement(
    'a',
    { href: '#',
      onClick: function onClick(e) {
        e.preventDefault();
        console.log(filter);
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: filter
        });
      }
    },
    children
  );
};

var TodoApp = function (_Component) {
  _inherits(TodoApp, _Component);

  function TodoApp() {
    _classCallCheck(this, TodoApp);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  TodoApp.prototype.render = function render() {
    var _this2 = this;

    var visibleTodos = getVisibleTodos(this.props.todos, this.props.visibilityFilter);
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
        visibleTodos.map(function (todo) {
          return React.createElement(
            'li',
            {
              style: {
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              },
              key: todo.id,
              onClick: function onClick() {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
              } },
            todo.text
          );
        })
      ),
      React.createElement(
        'p',
        null,
        'Show:',
        ' ',
        React.createElement(
          FilterLink,
          {
            filter: 'SHOW_ALL',
            currentFilter: this.props.visibilityFilter
          },
          'ALL'
        ),
        ' ',
        React.createElement(
          FilterLink,
          {
            filter: 'SHOW_ACTIVE',
            currentFilter: this.props.visibilityFilter
          },
          'ACTIVE'
        ),
        ' ',
        React.createElement(
          FilterLink,
          {
            filter: 'SHOW_COMPLETED',
            currentFilter: this.props.visibilityFilter
          },
          'COMPLETED'
        )
      )
    );
  };

  return TodoApp;
}(Component);

/*** Compenents end ***/

var render = function render() {
  ReactDOM.render(React.createElement(TodoApp, store.getState()), document.getElementById('root'));
};

render();

store.subscribe(render);
