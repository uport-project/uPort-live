import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import DatePicker from 'react-datepicker'
import { connect } from 'react-redux'
import moment from 'moment'

import { createEventIdentity } from './muport-id'
import { uploadToIpfs } from '../../misc'
import { createEvent } from './actions'
import { uport } from '../../user'

import loadingGif from '../../../img/loading.gif'
import uploadIcon from '../../../img/upload.png'
import eventImage from '../../../img/eventcredential.jpg'

import './EventCreator.css'
import 'react-datepicker/dist/react-datepicker.css'

/**
 * @classdesc
 * The event ownership attestation generator component 
 *
 * TODO: Inject this into a modal of some sort instead of taking up
 *       its own page ? maybe ?
 */
class EventCreator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {
        name: null,
        location: null,
        description: null
      },
      startDate: moment(),
      endDate: moment(),
      iconUrl: uploadIcon,
    }

    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * Generic method for updating a controlled field
   * @param {Event}  event              -- an onChange event fired by a field
   * @param {String} event.target.name  -- the name of the state variable and input 'name' field
   * @param {String} event.target.value -- the string value of the input field after the change
   */
  handleFieldChange(event) {
    const {name, value} = event.target
    this.setState({[name]: value})

    // Remove the error text
    if (!!this.state.errors[name] && value !== '') {
      const errors = Object.assign({}, this.state.errors, {[name]: null})
      this.setState({errors})
    }
  }

  /**
   * Fire an ipfs upload when an image is uploaded to the browser
   * when the hash comes back, update the iconUrl to the image's location
   * on ipfs, so that it is diplayed
   *
   * TODO: Could show the image before then, but it may be misleading
   * as we need to wait for the ipfs hash before we can give the credential
   */
  handleFileUpload(event) {
    const file = event.target.files[0]

    // Validate the file as an image
    if (!file || !file.type.startsWith('image/')) {
      alert('only images broh')
      return
    }

    // Show spinner while waiting for ipfs response
    this.setState({iconUrl: loadingGif})

    // Update the event icon when the hash comes back
    uploadToIpfs(file)
      .then((hash) => this.setState({iconUrl: `https://ipfs.io/ipfs/${hash}`}))
      .catch((err) => console.log(err))
  }

  /**
   * Individually validate each field, and display an error message
   * beside the inputs for failing (empty) values
   */
  checkFields() {
    let isValid = true
    const errors = Object.assign({}, this.state.errors)

    for (const field in errors) {
      // Add any more specific validation checks here
      if (!this.state[field]) {
        errors[field] = `Please enter a ${field} for your event`
        isValid = false
      }
    }

    this.setState({errors})
    return isValid
  }

  /**
   * Issue an event ownership credential, indicating the creation of an event.
   * The fields of the event ownership credential are populated by the controlled fields
   * of the input form
   * @param {Event} event -- the form submission event, only captured to prevent default
   */
  handleSubmit(event) {
    event.preventDefault()
    const {authData, createEvent} = this.props
    const {name, location, startDate, endDate, description, iconUrl} = this.state

    // Return early if invalid
    if (!this.checkFields()) {
      return
    }

    // Individual fields are taken from http://schema.org/Event 
    // and described further in schemas.md
    const eventDetails = {
      organizer: authData.address,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      name, location, description
    }

    // Only save the image if it's been provided
    if (iconUrl !== loadingGif && iconUrl !== uploadIcon) {
      eventDetails.image = iconUrl
    }

    // Create an event identity by serializing the muport profile
    createEventIdentity(eventDetails).then((muportId) => {
      // Use the mnemonic as the identity
      console.log(muportId.keyring.serialize())
      eventDetails.identity = muportId.keyring.serialize()

      // Issue the attestation
      uport.attestCredentials({
        sub: authData.address,
        claim: {
          uportLiveEvent: eventDetails
        }
      }).then(() => {
        createEvent(eventDetails)
        browserHistory.push('/dashboard')
      })
    })
  }

  /**
   * Display a form with fields to define a new event.  
   * Creation of the event will issue an attestation to the signed-in user
   * with the scanning of a QR code
   */
  render() {
    const {name, location, startDate, endDate, description, errors, iconUrl} = this.state

    // Set threshold to midnight
    const today = moment().startOf('day')

    // Self-validating update functions for start/end date
    const updateStartDate = (startDate) => {
      // TODO: maybe allow this anyway?
      if (startDate >= today) {
        this.setState({startDate})
        if (startDate > this.state.endDate)
          this.setState({endDate: startDate})
      }
    }

    const updateEndDate = (endDate) => {
      if (endDate >= this.state.startDate)
        this.setState({endDate})
    }

    return (
      <main className="container">
        <div id="bodyContent" className="ui two column stackable grid">
          <div className="row">
            <div id="left" className="six wide column">
              <h3>Use the form on this page to create an event</h3>
              <h3>The information entered here will be given to attendees when they check-in as part of their badge.  Be sure to double check each field, as they can't be edited later!</h3>
              <img id="sample-image" src={eventImage} />
            </div>

            <div id="right" className="ten wide column">
              <h1>Create an Event
                <label htmlFor="image" className="image-upload">
                  <input type="file" name="image" onChange={this.handleFileUpload}/>
                  <img id="event-icon" src={iconUrl} width={40} height={40} />
                </label>
              </h1>

              <form className="ui form" onSubmit={this.handleSubmit}>
                <div className="column">
                  <div className="field">
                    <h4>Event Name</h4>
                    <input type="text" name="name" value={name} onChange={this.handleFieldChange} placeholder="Event Name"/>
                    <span className="error">{errors.name}</span>
                  </div>
                  <div className="field">
                    <h4>Event Location</h4>
                    <input type="text" name="location" value={location} onChange={this.handleFieldChange} placeholder="Event location"/>
                    <span className="error">{errors.location}</span>
                  </div>
                  <div className="field">
                    <h4>About</h4>
                    <textarea type="text" name="description" value={description} onChange={this.handleFieldChange} placeholder="Describe your event"></textarea>
                    <span className="error">{errors.description}</span>
                  </div>
                  <div className="field">
                    <h4>Event Dates</h4>
                    <div className="fields">
                      <div className="field">
                        <DatePicker selected={startDate} onChange={updateStartDate} />
                      </div>
                      <div className="field">
                        <DatePicker selected={endDate} onChange={updateEndDate} />
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <input className="ui button" type="submit" value="Create!" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

// Connect to redux store
const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch => ({
    createEvent: eventData => dispatch(createEvent(eventData))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCreator)
