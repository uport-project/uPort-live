import React, { Component } from 'react'

import { LoginButton } from '../user'
import uPortLogo from '../../img/uport-logo.svg'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="ui three column width centered grid">
          <div className="row">
            <div className="column center aligned">
              <img className="uport-logo" src={uPortLogo} alt="uPort Logo" />
            </div>
          </div>
          <div className="row">
            <div className="column center aligned">
              <h1 className="banner-head">Create Proof of Attendence badges for your events with uPort Live</h1>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <LoginButton
                style={{
                  border: '1px solid #fff', 
                  padding: '0.25em 0.5em',
                  fontSize: '1.5rem'
                }}>
              <img className="uport-logo-icon" src={uPortLogo} alt="UPort Logo" /> Login with uPort
              </LoginButton>
            </div>
          </div>

        </div>
      </main>
    )
  }
}

export default Home
