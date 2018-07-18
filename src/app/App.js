import React, { Component } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import store from './store'
import {
  AppWrapper,
  Home, About, FAQ, 
  EventDashboard, EventCreator, EventCheckinAttestor,
  UserIsAuthenticated, UserIsNotAuthenticated
} from '../components'

const history = syncHistoryWithStore(browserHistory, store)

// Styles
import '../../semantic/dist/semantic.min.css'
import '../fonts/open-sans.css'
import './App.css'

/**
 * This is the App's root component, which specifies the routing etc.
 * The Main component (previously called App) wrapping all of these
 * routes is the MenuWrapper (defined below)
 */
const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppWrapper}>
        <IndexRoute component={UserIsNotAuthenticated(Home)} />
        <Route path="dashboard" component={UserIsAuthenticated(EventDashboard)} />
        {/* <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
        <Route path="create" component={UserIsAuthenticated(EventCreator)} />
        <Route path="checkin" component={UserIsAuthenticated(EventCheckinAttestor)} />
        <Route path="about" component={About} />
        <Route path="faq" component={FAQ} />
      </Route>
    </Router>
  </Provider>
)


export default App
