import React, { Component } from 'react'

import { VerifyEvent } from '../events'
import { LoginButton } from '../user'

import qrIcon from '../../img/qr-icon.png'
import eventIcon from '../../img/event-icon.png'
import credentialIcon from '../../img/credential-icon.png'
import uPortLogo from '../../img/uport-logo.svg'

import './Home.css'

const Home = () => (
  <main className="container">
    <div id="bodyContent" className="ui three column stackable centered grid">
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
        <div className="column center aligned">
          <LoginButton
            style={{
              border: '1px solid #fff', 
              borderRadius: '4px',
              padding: '0.5em 1em',
              fontSize: '1.5rem'
            }}>Login with uPort
          </LoginButton>
        </div>
      </div>
      <div id="imagerow" className="row">
        <div className="column center aligned">
          <div className="imgbox">
            <img className="feature" src={eventIcon} />
          </div>
          <h3>Create an Event</h3>
        </div>
        <div className="column center aligned">
          <div className="imgbox">
            <img className="feature" src={qrIcon} />
          </div>
          <h3>Check-in Attendees</h3>
        </div>
        <div className="column center aligned">
          <div className="imgbox">
            <img className="feature" src={credentialIcon} />
          </div>
          <h3>Verify Proof-of-Attendance</h3>
        </div>
      </div>
    </div>
  </main>
)  


export default Home
