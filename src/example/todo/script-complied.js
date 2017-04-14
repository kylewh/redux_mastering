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
var _ReactRedux = ReactRedux,
    connect = _ReactRedux.connect;
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
// only needed props is dispatch
// change const to let, because it doesn't have a container component for it
// itself is going to be a container 

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
          dispatch({
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

// It's pretty common pattern to inject just the dispatch function. 
// This is why if you specify null or any false value in connect 
// as the second argument, you're going to get dispatch injected as a prop. 

// The default behavior will be to not subscribe to this store 
// and to inject just the dispatch function as a prop.
AddTodo = connect()(AddTodo);

// **KEEP IN YOUR MIND**
// IF YOU DON'T SPECIFY THE CONTEXTTYPES
// YOU **WON'T** RECEIVE CONTEXT

// we will use context from Provider so we have to do this.
// AddTodo.contextTypes = {
//   store: React.PropTypes.object
// }


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
      dispatch({
        type: 'TOGGLE_TODO',
        id: id
      });
    }
  };
};

// connect is a **CURRIED** function so the return value is a function.
// using connect, we won't need to specify the contextTypes
// connect do it for us. => @TODO I really wanna more details about it, may be later.
// we can use it to generate container function
// container => receive state


// One thing to remind: 
// Although connect is a curried function, but the amount of argument in connect
// is fixed
// Passing in mapStateToProps or mapDispatchToProps or both of it is totally up to you
// Sometime our container may need to hanlde some event wrapped with dispatch
// so we do mapDispatchToProps
// Sometime we just want to pass in state
// then we do mapStateToProps, it's clear :)
// Connect will calculate the props to pass through the presentational component by merging
// the objects returned from mapStateToProps, mapDispatchToProps, and its own props.
var VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

// TodoList is the target to wrap and pass the props to

// using connect generate VisibleTodoList container for us ,
// we don't need to write manually

// so in the container , we did three things

// 1. receive store from Provider, which is the center we store all state
// 2. subscribe a force update function to store
// 3. unsubscribe when component will unmount


// class VisibleTodoList extends Component {
//   componentDidMount() {
//     const { store } = this.context
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     )
//   }
//   componentWillUnMount() {
//     this.unsubscribe()
//   }
//   render () {
//     const { store } = this.context
//     const state = store.getState()
//     return (
//       <TodoList
//       />
//     )
//   }
// }

// we will use context from Provider so we have to do this.
// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// }

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

var FilterLink = function (_Component) {
  _inherits(FilterLink, _Component);

  function FilterLink() {
    _classCallCheck(this, FilterLink);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  FilterLink.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var store = this.context.store;

    this.unsubscribe = store.subscribe(function () {
      return _this2.forceUpdate();
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

// This time we use Provider offered by React-Redux
var _ReactRedux2 = ReactRedux,
    Provider = _ReactRedux2.Provider;

var todoApp = combineReducers({ todos: todos, visibilityFilter: visibilityFilter });
ReactDOM.render(React.createElement(
  Provider,
  { store: createStore(todoApp) },
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
