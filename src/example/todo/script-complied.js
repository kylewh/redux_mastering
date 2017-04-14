'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Redux = Redux,
    combineReducers = _Redux.combineReducers,
    createStore = _Redux.createStore;
var _React = React,
    Component = _React.Component;
var _ReactRedux = ReactRedux,
    Provider = _ReactRedux.Provider,
    connect = _ReactRedux.connect;


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
      return [].concat(state, [todo(undefined, action)]);
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

// action creator
var addTodo = function addTodo(text) {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text: text
  };
};

// action creator
var toggleTodo = function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
    id: id
  };
};

// action creator
var setVisibilityFilter = function setVisibilityFilter(filter) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
};

var AddTodo = function AddTodo(_ref) {
  var dispatch = _ref.dispatch;

  var input = void 0;
  return React.createElement(
    'div',
    null,
    React.createElement('input', { ref: function ref(node) {
        input = node;
      } }),
    React.createElement(
      'button',
      { onClick: function onClick() {
          dispatch(addTodo(input.value));
          input.value = '';
        } },
      'Add Todo'
    )
  );
};

AddTodo = connect()(AddTodo);

// Purely presentational component
var Todo = function Todo(_ref2) {
  var onClick = _ref2.onClick,
      completed = _ref2.completed,
      text = _ref2.text;
  return React.createElement(
    'li',
    {
      style: {
        textDecoration: completed ? 'line-through' : 'none',
        cursor: 'pointer'
      },
      onClick: onClick },
    text
  );
};

var TodoList = function TodoList(_ref3) {
  var todos = _ref3.todos,
      onTodoClick = _ref3.onTodoClick;
  return React.createElement(
    'ul',
    null,
    todos.map(function (todo) {
      return React.createElement(Todo, _extends({
        key: todo.id
      }, todo, {
        onClick: function onClick() {
          return onTodoClick(todo.id);
        }
      }));
    })
  );
};

var mapStateToTodoListProps = function mapStateToTodoListProps(state) {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

var mapDispatchToTodoListProps = function mapDispatchToTodoListProps(dispatch) {
  return {
    onTodoClick: function onTodoClick(id) {
      dispatch(toggleTodo(id));
    }
  };
};

var VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

var Link = function Link(_ref4) {
  var active = _ref4.active,
      children = _ref4.children,
      _onClick = _ref4.onClick;

  if (active) {
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
        _onClick();
      }
    },
    children
  );
};

var mapStateToLinkProps = function mapStateToLinkProps(state, ownProps) {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

var mapDispatchToLinkProps = function mapDispatchToLinkProps(dispatch, ownProps) {
  return {
    onClick: function onClick() {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};

var FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

var Footer = function Footer() {
  return React.createElement(
    'p',
    null,
    'Show:',
    ' ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ALL' },
      'ALL'
    ),
    ' ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_ACTIVE' },
      'ACTIVE'
    ),
    ' ',
    React.createElement(
      FilterLink,
      { filter: 'SHOW_COMPLETED' },
      'COMPLETED'
    )
  );
};

var TodoApp = function TodoApp() {
  return React.createElement(
    'div',
    null,
    React.createElement(AddTodo, null),
    React.createElement(VisibleTodoList, null),
    React.createElement(Footer, null)
  );
};

ReactDOM.render(React.createElement(
  Provider,
  { store: createStore(combineReducers({ todos: todos, visibilityFilter: visibilityFilter })) },
  React.createElement(TodoApp, null)
), document.getElementById('root'));
