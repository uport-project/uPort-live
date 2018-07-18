import React, { Component } from 'react'
import { Connect, SimpleSigner, Credentials, QRUtil } from 'uport-connect'
import { connect } from 'react-redux'
import { createJWT } from 'did-jwt'
import Keyring from 'muport-core/lib/keyring'

import { endCheckin } from './actions'
import { uport } from '../../user'

import uPortLogo from '../../../img/uport-logo.svg'

/**
 * @classdesc
 * This component presents an infinite checkin flow for a particular
 * event, with it's own ethr-did keypair based identity
 */
export class EventCheckinAttestor extends Component {
  constructor(props) {
    super(props)

    // TODO: Maybe move this into the redux store or something so that
    // it can persist accross checkin sessions? unsure if this is possible
    this.state = {
      QR: null,
      checkinCount: 0
    }

    this.doCheckin = this.doCheckin.bind(this)
    this.updateQR = this.updateQR.bind(this)
  }

  componentDidMount() {
    if (this.props.eventData) 
      this.createEventIdentity(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.eventData) 
      this.createEventIdentity(nextProps)
  }

  /**
   * Create a new instance of Connect with the did + private Key of
   * the *event* itself. This is saved onto the component as this.eventIdentity.
   * Additionally this creates the claim that will be issued to attendees, and
   * saves it as this.claim.  Finally creates a checkin waiting handler
   * to continuously update the QR code and allow new users to check in
   */
  createEventIdentity(props) {
    // Extract relevant data from the owner's event credential
    const {identifier, ...details} = props.eventData
    
    // Build the credential to be issued to people
    this.claim = details

    // Generate the private key from the mnemonic
    const {did, mnemonic} = identifier
    const keyring = new Keyring({mnemonic})

    // Create a connect instance for the Event's keypair
    const signer = keyring.getJWTSigner()

    this.eventIdentity = {issuer: did, signer}

    // Function to initiate the checkin flow
    this.waitForCheckin = () => {
      this.eventIdentity.requestCredentials({ 
        requested: ['address', 'name'],
      }, this.updateQR).then(this.doCheckin)
    }

    this.waitForCheckin()
  }

  /**
   * Regenerate the displayed QR code on the checkin page
   */
  updateQR(uri /*, cancel, appName, firstRequest*/ ) {
    const QR = QRUtil.getQRDataURI(uri)
    this.setState({QR})
  }

  /**
   * Pop up a new uport login flow, initiated by the Connect object
   * with the identity of the event
   */
  doCheckin({address}) {
    const {checkinCount} = this.state

    // Sign the attendee field as a JWT
    createJWT({attendee: address}, this.eventIdentity).then((signature) => {
      const claim = {
        uportLiveAttendance: {...this.claim, signature}
      }

      // Push the attendance credential
      uport.attestCredentials({
        sub: address, claim
      })

      // Update the checkin count
      this.setState({checkinCount: checkinCount + 1})
    })


    // Restart the flow
    this.waitForCheckin()
  }

  render() {
    const {returnToDashboard, eventData} = this.props
    const name = eventData && eventData.name
    const {checkinCount, QR} = this.state
    const location = eventData && eventData.location
    const about = eventData && eventData.about

    return (
      <main className="container">
        <div id="bodyContent" className="ui two column stackable grid">
          <div className="row">
            <div className="six wide column">
              <br></br><br></br>
              <div className="ui animated button" onClick={returnToDashboard} tabIndex="0">
                <div className="visible content">Back</div>
                <div className="hidden content">
                  <i className="left arrow icon"></i>
                </div>
              </div>
              <h1>Welcome to {name}!</h1>
              <h3>Use your uPort mobile application to check in and receive a Proof of Attendance credential</h3>
              <h3>About the event </h3>
              <p>{about}</p>
            </div>
            <div className="ten wide column">
              <img src={QR} />
              {/*<button className="ui button" id="checkin" onClick={this.doCheckin} disabled={!eventData}>
                <img className="uport-logo-icon" src={uPortLogo} alt="UPort Logo" />Check in with uPort
              </button>*/}
              <h5>{checkinCount} attendees checked in so far</h5>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

// Connect with redux 
const mapStateToProps = (state, ownProps) => ({
  eventData: state.events.checkin
})

const mapDispatchToProps = (dispatch) => ({
  returnToDashboard: (event) => {
    event.preventDefault()
    dispatch(endCheckin())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCheckinAttestor)