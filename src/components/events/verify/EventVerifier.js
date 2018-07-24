import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { QRUtil } from 'uport-connect'
import { verifyJWT, decodeJWT } from 'did-jwt'
import registerEthrDidResolver from 'ethr-did-resolver'
import queryString from 'query-string'

import { registerModal, showModal, cancelModal, showSpinner } from '../../misc'
import { uport } from '../../user/util'

import successIcon from '../../../img/success.png'
import failureIcon from '../../../img/failure.png'

import './EventVerifier.css'

// Ensure that the ethr-did-resolver is available to all did methods
// (In particular those of did-jwt)
registerEthrDidResolver()

/**
 * @classdesc
 * A component for verifying a User's event attendance.  Given an event's
 * did taken from the URL query parameters, start a selective disclosure
 * flow requesting attendance credentials.  Depending on the type of 
 * credential, perform the appropriate verification, and display the 
 * result to the user in a modal that dismisses itself.
 */
class EventVerifier extends Component {
  constructor(props) {
    super(props)

    this.state = {
      QR: null,
      eventDID: ''
    }

    this.doVerify = this.doVerify.bind(this)
    this.updateQR = this.updateQR.bind(this)
  }

  /**
   * 
   */
  componentDidMount() {
    const params = queryString.parse(this.props.location.search)
    this.setState({eventDID: params.event})

    // Function to initiate the checkin flow
    this.waitForVerify = () => {
      uport.requestCredentials({ 
        requested: ['name'],
        verified: ['uportLiveAttendance']
      }, this.updateQR).then((data) => {
        this.doVerify(data)
      })
    }

    this.waitForVerify()
  }

  /**
   * Regenerate the displayed QR code on the checkin page
   */
  updateQR(uri) {
    const QR = QRUtil.getQRDataURI(uri)
    this.setState({QR})
  }

  /**
   * Given a set of credentials obtained from a particular user,
   * search the list of verified credentials for one that matches
   * 
   */
  doVerify (credentials) {
    const { verified, address, name } = credentials
    const { showSuccessModal, showFailureModal, showSpinner } = this.props
    const { eventDID } = this.state

    showSpinner('Verifying...')

    // Keep track of whether or not the event in question was found
    let success = false
    const verifiers = []

    for (const att of verified) {
      const { signature } = att.claim.uportLiveAttendance

      if (signature) {
        // Verify credential signed by uport live app, containing signature field
        verifiers.push(verifyJWT(signature, {aud: uport.address}).then(({payload, issuer}) => {
          const { attendee } = payload
          if (issuer === eventDID && attendee === address) {
            success = true
          }
        })).catch(err => console.log(err))
      } else if (att.iss === eventDID && att.sub === address) {
        // Verify credential signed by event did
        showSuccessModal({name, eventDID})
        return
      }
    }

    // Show the proper modal only after all verifications have been checked
    Promise.all(verifiers).then(() => {
      if (success) {
        showSuccessModal({name, eventDID})
      } else {
        showFailureModal({name, eventDID})
      }
    })
  }

  render(){
    return (
      <main className="container">
        <div id="bodyContent" className="ui two column stackable grid">
        <div className="row">
          <div className="six wide column">
          <br></br><br></br>
          <div onClick={() => browserHistory.push('/dashboard')} className="ui animated button" tabIndex="0">
            <div className="visible content">Back</div>
            <div className="hidden content">
              <i className="left arrow icon"></i>
            </div>
          </div>
          <h1>Check in</h1>
          <h3>Share your attendance credential for the event and get access</h3>
          <br></br>
          <h2 id='verified'>
            
          </h2>
          </div>
          <div className="ten wide column">
            <img src={this.state.QR} />
            <h5>Share the URL with other organizers to verify attendees faster!</h5>
          </div>
        </div>
        </div>
      </main>
    )
  }
}

/**
 * Message to display if a user has the requested verification
 */
const SuccessModal = ({name, eventDID, cancel}) => {
  // Auto-dismiss after 2 seconds
  setTimeout(cancel, 2000)

  return (
    <div className="verify-success">
      <h2>Attendance Vefified!</h2>
      <img className="verify-img" src={successIcon} alt="Verification Success" />
      <div>Thanks, {name}! We've verified your attendance credential for {eventDID}!</div>
    </div>
  )
}

/**
 * Message to display if the the user does not have the requested verification
 */
const FailureModal = ({name, eventDID}) => (
  <div className="verify-failure">
    <h2>Verification Failed</h2>
    <img className="verify-img" src={failureIcon} alt="Verification Failed"/>
    <div>Sorry, {name}, we could not find an attendance credential for {eventDID}</div>
  </div>
)

registerModal('SuccessModal', SuccessModal)
registerModal('FailureModal', FailureModal)

const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  showSuccessModal: (props) => dispatch(showModal('SuccessModal', {
    ...props, cancel: () => dispatch(cancelModal())
  })),
  showFailureModal: (props) => dispatch(showModal('FailureModal', {
    ...props, cancel: () => dispatch(cancelModal())
  })),
  showSpinner: (message) => dispatch(showSpinner(message))
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(EventVerifier)