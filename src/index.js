import React from 'react'
import { render } from 'react-dom'
import storeConfig from './storeConfig'
import Root from './components/Root'

const store = storeConfig()

render(
  <Root store={store} />,
  document.getElementById('root')
)
