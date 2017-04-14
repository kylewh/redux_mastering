'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Redux = Redux,
    combineReducers = _Redux.combineReducers,
    createStore = _Redux.createStore;
var _React = React,
    Component = _React.Component;
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

// we can remove it and pass it as props into the <todoApp />
// const todoApp = combineReducers({ todos, visibilityFilter })
// const store = createStore(todoApp)

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

// Functional Component
// The second argument is context
var AddTodo = function AddTodo(props, _ref) {
  var store = _ref.store;

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
// **KEEP IN YOUR MIND**
// IF YOU DON'T SPECIFY THE CONTEXTTYPES
// YOU **WON'T** RECEIVE CONTEXT

// we will use context from Provider so we have to do this.
AddTodo.contextTypes = {
  store: React.PropTypes.object
};

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

/**
 * Top level - Container components
 * VisibleTodoList
 *     ---TodoList
 *         ---Todo
 */

var VisibleTodoList = function (_Component) {
  _inherits(VisibleTodoList, _Component);

  function VisibleTodoList() {
    _classCallCheck(this, VisibleTodoList);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  VisibleTodoList.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var store = this.context.store;

    this.unsubscribe = store.subscribe(function () {
      return _this2.forceUpdate();
    });
  };

  VisibleTodoList.prototype.componentWillUnMount = function componentWillUnMount() {
    this.unsubscribe();
  };

  VisibleTodoList.prototype.render = function render() {
    var store = this.context.store;

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
// we will use context from Provider so we have to do this.


VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

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

// Container Component 
// provide data and behavior for the presentational component

/**
 * Secondary Top level - Container components
 * FilterLink
 *    ---Link
 */

var FilterLink = function (_Component2) {
  _inherits(FilterLink, _Component2);

  function FilterLink() {
    _classCallCheck(this, FilterLink);

    return _possibleConstructorReturn(this, _Component2.apply(this, arguments));
  }

  FilterLink.prototype.componentDidMount = function componentDidMount() {
    var _this4 = this;

    var store = this.context.store;

    this.unsubscribe = store.subscribe(function () {
      return _this4.forceUpdate();
    });
  };

  FilterLink.prototype.componentWillUnMount = function componentWillUnMount() {
    this.unsubscribe();
  };

  FilterLink.prototype.render = function render() {
    var store = this.context.store;

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
// we will use context from Provider so we have to do this.


FilterLink.contextTypes = {
  store: React.PropTypes.object
};

// presentational Compenents
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

var TodoApp = function TodoApp(_ref5) {
  var store = _ref5.store;
  return React.createElement(
    'div',
    null,
    React.createElement(AddTodo, null),
    React.createElement(VisibleTodoList, null),
    React.createElement(Footer, null)
  );
};
/*** Compenents end ***/

// After passed store as a props, we have to do repetitive stuff,
// that add props store in every container component and child Compenents
// which needs store to be available.

// We will fix these tedious stuff later by applying API from 'react-redux'

// In particular, this.props.children is a special prop,
// typically defined by the child tags in the JSX expression rather than in the tag itself.

// Problem:
// Is there a solution that let us pass down the props through the component tree
// without mannually do it.

// SEE HERE: https://facebook.github.io/react/docs/context.html

var Provider = function (_Component3) {
  _inherits(Provider, _Component3);

  function Provider() {
    _classCallCheck(this, Provider);

    return _possibleConstructorReturn(this, _Component3.apply(this, arguments));
  }

  Provider.prototype.getChildContext = function getChildContext() {
    return {
      store: this.props.store
    };
  };

  Provider.prototype.render = function render() {
    return this.props.children;
  };

  return Provider;
}(Component);
// we will use context so we have to do this.


Provider.childContextTypes = {
  store: React.PropTypes.object
};

ReactDOM.render(React.createElement(
  Provider,
  { store: createStore(combineReducers({ todos: todos, visibilityFilter: visibilityFilter })) },
  React.createElement(TodoApp, null)
), document.getElementById('root'));

/**
 * So we can notice context's mechanism is implicitly pass down the data.
 * It's powerful.
 * But's gloabal variable (Its nature) is not that good
 * Unless you're using it for dependency injection, 
 * like here when we need to make a single object available to all 
 * components, then probably you shouldn't use context.
 */
