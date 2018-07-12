import React, { Component } from 'react'
import { browserHistory } from  'react-router'
import { connect } from 'react-redux'
import { QRUtil } from 'uport-connect'

import { loginUser } from './actions'
import { Spinner } from '../../misc'
import { uport } from '../util/connector'

import './LoginModal.css'
import appleButton from '../../../img/apple-app.svg'
import androidButton from '../../../img/android-app.svg'

/**
 * This module is a recreation of the login modal built by uport-connect/util
 * We are rebuilding this from scratch to allow for better handling of the QR
 * codes and spinner behavior after/during login
 */

// Links to the uport app in the itunes and google play stores
const apppleStoreLink = `https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8`
const googleStoreLink = `https://play.google.com/store/apps/details?id=com.uportMobile`

class LoginModal extends Component {
	constructor(props) {
    super(props)

    this.state = {
      showSpinner: false,
      QR: null,
      appName: '',
    }

    this.uriHandler = this.uriHandler.bind(this)
    this.cancelLogin = this.cancelLogin.bind(this)
  }

  /**
   * Make sure that any new login window doesn't show the spinner
   * Since the closeUriHandler is fired when the dialog is abandoned,
   * this can happen if the login modal is closed and quickly reopened 
   * on the same page.  This fixes it.
   */
  componentWillReceiveProps() {
    this.setState({showSpinner: false})
  }


  /**
   * On the first mount, we begin the login request, and monkeypatch
   * the connect instance with our uri handlers. This only needs to 
   * be done once, as subsequent renders will have the same login QR
   */
  componentDidMount() {
    const { doLogin } = this.props

    // SUPER HACK ALERT
    // Monkey-patching the uri-handlers because if you specify a specific
    // Uri-handler, the closeUriHandler never fires.  
    // Fuck, this took me so long to figure out
    uport.uriHandler = this.uriHandler
    uport.closeUriHandler = () => {
      this.setState({showSpinner: true})
    }

    // UPort and its web3 instance are defined in ../../../util/wrappers.
    // Request uPort persona of account passed via QR
    uport.requestCredentials({
      requested: ['name', 'avatar', 'phone', 'country'],
      // This is where we request the uPort Live Events
      verified: ['uportLiveEvent'],
      notifications: true
    }).then((credentials) => {
      // Hack the uriHandlers back to the defaults
      uport.closeUriHandler = QRUtil.closeQr
      uport.uriHandler = QRUtil.openQr
      // Dispatch the login event and save the credentials
      doLogin(credentials)
    })
  }

  /**
   * Set the QR code and app details after the login component mounts
   * and the login has been requested
   */
  uriHandler(uri, cancel, appName) {
    const QR = QRUtil.getQRDataURI(uri)
    this.setState({QR, appName, cancel})
  }

  /**
   * Cancel handler if the login is aborted.
   * Redirects back to the original page (kills the modal)
   * and cancels the listener on the messaging server
   */
  cancelLogin() {
    const { pathname } = browserHistory.getCurrentLocation()
    browserHistory.push(pathname)
  }

  render() {
    const { showSpinner, QR, appName} = this.state

    return (
      <div className="modal fade-in" onClick={this.cancelLogin}>
        {showSpinner ? (
          <Spinner />
        ) : (
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cancel"
              onClick={this.cancelLogin}>x</button>
            <h2> Login to <strong className="purple">{appName}</strong></h2>
            <em>Scan the QR code with your uPort Mobile App</em><br/>
            <img src={QR} alt="Login QR Code - Scan with uPort Mobile App" />
            <hr/>
            <h3 style={{marginBottom: '1em'}}>Don't have uPort?</h3>
            <div className="buttons">
              <a href={apppleStoreLink}><img src={appleButton} alt="download from app store" /></a>
              <a href={googleStoreLink}><img src={androidButton} alt="download from google play store" /></a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (credentials) => {
      dispatch(loginUser(credentials))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal)
