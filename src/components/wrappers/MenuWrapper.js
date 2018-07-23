import React from 'react'
import { Link } from 'react-router'

import { VisibleOnlyAuth, HiddenOnlyAuth, LoginButton, LogoutButton } from '../user'


/**
 * A dumb component for links in the menu bar
 */
const MenuLink = ({name, route}) => (
  <li className="menu-item">
    <Link to={route} className="menu-link">{name}</Link>
  </li>
)

/**
 * The MenuWrapper component wraps all individual pages with a navbar,
 * as well as a footer.
 */
const MenuWrapper = ({children}) => {
  // Links to always be displayed regardless of login state
  const commonLinks = [
    {route: '/about', name: 'about'},
    {route: '/faq', name: 'faq'},
  ].map((props) => 
    <MenuLink {...props} key={props.route} />
  )

  // Links to be displayed to logged in users
  const OnlyAuthLinks = VisibleOnlyAuth(() =>
    <ul className="navbar-right">
      <MenuLink route="/dashboard" name="dashboard" />
      {commonLinks}
      <li className="menu-item">
        <LogoutButton />
      </li>
    </ul>
  )

  // Links to be displayed to logged out users
  const OnlyGuestLinks = HiddenOnlyAuth(() =>
    <ul className="navbar-right">
      <MenuLink route="/" name="home" />
      {commonLinks}
      <li className="menu-item">
        <LoginButton>login</LoginButton>
      </li>
    </ul>
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

export default MenuWrapper