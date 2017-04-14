'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
 *  Todo
 *    @param {Function} onClick
 *                      Dispatch 'TOGGLE_TODO' action
 *    @param {Boolean}  completed
 *                      When todo was clicked, toggle action will invert its state
 *    @param {String}   text
 *                      Content of todoItem, from AddTodo's loacal variable 'input'
 *                      input refers to input element by using ref={node => input = node}
 * 
 *  TodoList
 *    @param {Array}    todos
 *                      Todos array, but was filtered by visibilityFilter
 *    @param {Function} onTodoClick
 *                      Passed to Todo as @param {Function} onClick
 *                      
 *  AddTodo
 *    @param {Function} onAddClick
 *                      Dispatch 'ADD_TODO' action
 * 
 *  FilterLink
 *    @param {String}   filter
 *                      Specify the state of visibilityFilter
 *    @param {String}   currentFilter
 *                      Passed from Footer @param {String} visibilityFilter
 *    @param {Function} onClick
 *                      @param {String} filter => @param {String} filter
 *                      Dispatch 'SET_VISIBILITY_FILTER' action
 * 
 *  Footer
 *    @param {String}   visibilityFilter
 *                      Passed from @param {String} visibilityFilter
 *                       
 *    @param {Function} onFilterClick
 *                      Passed to FilterLink @param {Function} onClick
 *                      Dispatch 'SET_VISIBILITY_FILTER' action
 *  TodoApp
 *    @param {Array}    todos
 *                      store.getState().todos
 *    @param {String}   visibilityFilter
 *                      store.getState().visibilityFilter
 */

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

var AddTodo = function AddTodo(_ref3) {
  var onAddClick = _ref3.onAddClick;

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
          onAddClick(input.value);
          input.value = '';
        } },
      'Add Todo'
    )
  );
};

var FilterLink = function FilterLink(_ref4) {
  var filter = _ref4.filter,
      currentFilter = _ref4.currentFilter,
      children = _ref4.children,
      _onClick = _ref4.onClick;

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
        _onClick(filter);
      }
    },
    children
  );
};

var Footer = function Footer(_ref5) {
  var visibilityFilter = _ref5.visibilityFilter,
      onFilterClick = _ref5.onFilterClick;
  return React.createElement(
    'p',
    null,
    'Show:',
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ALL',
        currentFilter: visibilityFilter,
        onClick: onFilterClick
      },
      'ALL'
    ),
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_ACTIVE',
        currentFilter: visibilityFilter,
        onClick: onFilterClick
      },
      'ACTIVE'
    ),
    ' ',
    React.createElement(
      FilterLink,
      {
        filter: 'SHOW_COMPLETED',
        currentFilter: visibilityFilter,
        onClick: onFilterClick
      },
      'COMPLETED'
    )
  );
};

var TodoApp = function TodoApp(_ref6) {
  var todos = _ref6.todos,
      visibilityFilter = _ref6.visibilityFilter;
  return React.createElement(
    'div',
    null,
    React.createElement(AddTodo, {
      onAddClick: function onAddClick(text) {
        return store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: text
        });
      }
    }),
    React.createElement(TodoList, {
      todos: getVisibleTodos(todos, visibilityFilter),
      onTodoClick: function onTodoClick(id) {
        return store.dispatch({
          type: 'TOGGLE_TODO',
          id: id
        });
      }
    }),
    React.createElement(Footer, {
      visibilityFilter: visibilityFilter,
      onFilterClick: function onFilterClick(filter) {
        return store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: filter
        });
      }
    })
  );
};

/*** Compenents end ***/

var render = function render() {
  ReactDOM.render(React.createElement(TodoApp, store.getState()), document.getElementById('root'));
};

render();

store.subscribe(render);
