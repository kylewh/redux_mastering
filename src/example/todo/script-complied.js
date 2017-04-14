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
// It either as a presentational components or 
// as a container components because it doesn't fit either category
// The input and the button are the presentational part,
// but dispatching an action onClick is the behavior 
// which is usually specified by the container.
var AddTodo = function AddTodo() {
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
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          });
          input.value = '';
        } },
      'Add Todo'
    )
  );
};

// Purely presentational component
var Todo = function Todo(_ref) {
  var onClick = _ref.onClick,
      completed = _ref.completed,
      text = _ref.text;
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

var TodoList = function TodoList(_ref2) {
  var todos = _ref2.todos,
      onTodoClick = _ref2.onTodoClick;
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

var VisibleTodoList = function (_Component) {
  _inherits(VisibleTodoList, _Component);

  function VisibleTodoList() {
    _classCallCheck(this, VisibleTodoList);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  VisibleTodoList.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this.unsubscribe = store.subscribe(function () {
      return _this2.forceUpdate();
    });
  };

  VisibleTodoList.prototype.componentWillUnMount = function componentWillUnMount() {
    this.unsubscribe();
  };

  VisibleTodoList.prototype.render = function render() {
    var props = this.props;
    var state = store.getState();
    return React.createElement(TodoList, {
      todos: getVisibleTodos(state.todos, state.visibilityFilter),
      onTodoClick: function onTodoClick(id) {
        return store.dispatch({
          type: 'TOGGLE_TODO',
          id: id
        });
      }
    });
  };

  return VisibleTodoList;
}(Component);

var Link = function Link(_ref3) {
  var active = _ref3.active,
      children = _ref3.children,
      _onClick = _ref3.onClick;

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

// Container Component 
// provide data and behavior for the presentational component

var FilterLink = function (_Component2) {
  _inherits(FilterLink, _Component2);

  function FilterLink() {
    _classCallCheck(this, FilterLink);

    return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
  }

  FilterLink.prototype.componentDidMount = function componentDidMount() {
    var _this4 = this;

    this.unsubscribe = store.subscribe(function () {
      return _this4.forceUpdate();
    });
  };

  FilterLink.prototype.componentWillUnMount = function componentWillUnMount() {
    this.unsubscribe();
  };

  FilterLink.prototype.render = function render() {
    var props = this.props;
    var state = store.getState();
    return React.createElement(
      Link,
      {
        active: props.filter === state.visibilityFilter,
        onClick: function onClick() {
          return store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          });
        }
      },
      props.children
    );
  };

  return FilterLink;
}(Component);

var Footer = function Footer() {
  return React.createElement(
    'p',
    null,
    'Show:',
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ALL'
      },
      'ALL'
    ),
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ACTIVE'
      },
      'ACTIVE'
    ),
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_COMPLETED'
      },
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
/*** Compenents end ***/

ReactDOM.render(React.createElement(TodoApp, null), document.getElementById('root'));
