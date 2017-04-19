import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions' // all actionCreators in actions/index.js
import { withRouter } from 'react-router'
import { getVisibleTodos } from '../reducers'
import TodoList from './TodoList'

class VisibleTodoList extends Component {

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate (preProps) {
    if (this.props.filter !== preProps.filter ) {
      this.fetchData()
    }
  }

  fetchData () {
    const  { filter, fetchTodos } = this.props
    fetchTodos(filter)
  }

  render () {
    const { toggleTodo, todos } = this.props
    return (
      <TodoList
        todos={todos}
        onTodoClick={toggleTodo}
      />
    )
  }
  
}

const mapStateToProps = (state, { match }) => {
  const filter = match.params.filter || 'all'
  return {
    todos: getVisibleTodos(state, filter),
    filter,
  }
}

// const mapDispatchToProps = (dispatch) => ({
//   onTodoClick(id) {
//     dispatch(toggleTodo(id));
//   }
// })

/**
 * actions :
 * receiveTodos
 * addTodo
 * toggleTodo
 * 
 * all wrapped with dispatch and become props of the 
 * VisibleTodoList
 */
VisibleTodoList = withRouter(connect(
  mapStateToProps,
  actions,
)(VisibleTodoList))

export default VisibleTodoList
