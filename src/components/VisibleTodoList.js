import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { withRouter } from 'react-router'
import { getVisibleTodos, getErrorMessage, getIsFetching } from '../reducers'
import TodoList from './TodoList'
import FetchError from './FetchError'

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
    fetchTodos(filter).then(() => console.log('done!'))
  }

  render () {
    const { toggleTodo, errorMessage, todos, isFetching } = this.props
    if (isFetching && !todos.length) {
      return <p>Loading...</p>
    }
    if ( errorMessage && !todos.length) {
      return (
        <FetchError
          message={errorMessage}
          onRetry={() => this.fetchData()}
        />
      )
    }
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
    errorMessage: getErrorMessage(state, filter),
    isFetching: getIsFetching(state, filter),
    filter,
  }
}

/**
 * actions :
 * requestTodos
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
