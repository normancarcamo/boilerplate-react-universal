import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App.js'
import { disableLogHMR } from 'assets/js/helpers'

const refresh = 'pushState' in window.history

ReactDOM.hydrate(
  <BrowserRouter forceRefresh={!refresh}>
    <AppContainer>
      <App {...window.__INITIAL_STATE__} />
    </AppContainer>
  </BrowserRouter> , document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
  disableLogHMR()
}
