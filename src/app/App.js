import React, { Component } from 'react'
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import store from './store'
import { 
  LoginButton, LogoutButton, LoginModal,
  Home, About, FAQ, 
  EventDashboard, EventCreator, EventCheckinAttestor, VerifyEvent,
  UserIsAuthenticated, UserIsNotAuthenticated, HiddenOnlyAuth, VisibleOnlyAuth
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
      <Route path="/" component={MenuWrapper}>
        <IndexRoute component={UserIsNotAuthenticated(Home)} />
        <Route path="dashboard" component={UserIsAuthenticated(EventDashboard)} />
        {/* <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
        <Route path="create" component={UserIsAuthenticated(EventCreator)} />
        <Route path="checkin" component={UserIsAuthenticated(EventCheckinAttestor)} />
        <Route path="about" component={About} />
        <Route path="faq" component={FAQ} />
        <Route path="verify" component={VerifyEvent}/>
      </Route>
    </Router>
  </Provider>
)


export default App

/**
 * The MenuWrapper component wraps all individual pages with a navbar
 * with conditional display for different links depending on Auth state
 */
const MenuWrapper = ({children, ...props}) => {
  // Links to be displayed to logged in users
  const OnlyAuthLinks = VisibleOnlyAuth(() =>
    <ul className="navbar-right">
      <li className="menu-item">
        <Link to="/dashboard" className="menu-link">dashboard</Link>
      </li>
      {/* <li className="menu-item">
        <Link to="/profile" className="menu-link">profile</Link>
      </li> */}
      <li className="menu-item">
        <Link to="/about" className="menu-link">about</Link>
      </li>
      <li className="menu-item">
        <Link to="/FAQ" className="menu-link">faq</Link>
      </li>
      <li className="menu-item">
        <LogoutButton />
      </li>
    </ul>
  )

  // Links to be displayed to logged out users
  const OnlyGuestLinks = HiddenOnlyAuth(() =>
    <ul className="navbar-right">
      <li className="menu-item">
        <Link to="/" className="menu-link">home</Link>
      </li>
      {/* <li className="menu-item">
        <Link to="/verify" className="menu-link">verify</Link>
      </li> */}
      <li className="menu-item">
        <Link to="/about" className="menu-link">about</Link>
      </li>
      <li className="menu-item">
        <Link to="/FAQ" className="menu-link">faq</Link>
      </li>
      <li className="menu-item">
        <LoginButton>login</LoginButton>
      </li>
    </ul>
  )

  const { location } = props

  // Show login if it is specifically requested
  const showLoginModal = !!(
    location && location.query 
    && 'login' in location.query
    // In case we want to show a separate login page 
    && location.pathname !== '/login'
  )

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-heading">
          <Link to="/"><h2>uPort Live</h2></Link>
        </div>
        <OnlyAuthLinks />
        <OnlyGuestLinks />
      </nav>
      {children}
      {showLoginModal && <LoginModal />}
      <footer className="footer">
        <div className="ui grid">
          <div className="row">
            <div className="footer-desc column center aligned">2018 © uPort</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
