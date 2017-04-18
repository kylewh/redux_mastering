import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route} from 'react-router-dom'
// import { Router, Route, browserHistory } from 'react-router';
import App from './App'

const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/:filter?" component={App} exact={false} />
    </BrowserRouter>
  </Provider>
)

export default Root
