import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { QRUtil } from 'uport-connect'
import { uport } from '../../user/util'

import queryString from 'query-string'

/**
 * @classdesc
 * A component for verifying event did of a user
 *
 */
// const VerifyEvent = ({did}) => {
class VerifyEvent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            QR: null,
            event: ""
        }

        this.doCheckin = this.doCheckin.bind(this)
        this.updateQR = this.updateQR.bind(this)
    }
    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        this.setState({event:values.event})
        this.createEventIdentity(this.props)
    }

    returnDashboard = (event) => {
        event.preventDefault()
        browserHistory.push('/dashboard')
    }

    /**
     * Regenerate the displayed QR code on the checkin page
     */
    updateQR(uri) {
        const QR = QRUtil.getQRDataURI(uri)
        this.setState({QR})
    }

    createEventIdentity() {
        // Function to initiate the checkin flow
        this.waitForCheckin = () => {
          uport.requestCredentials(
            { requested:['name'], verified: ['uportLiveEvent'] }, 
            this.updateQR
          ).then((data) => {
            this.doCheckin(data)
          })
        }
    
        this.waitForCheckin()
      }

    doCheckin (data){
        const verified = data.verified
        let notif = document.getElementById('verified')
        for (var i = 0; i < verified.length; i++){
            if (verified[i].claim.uportLiveEvent.identifier.did == this.state.event &&
            verified[i].sub == data.address){
                notif.innerHTML = "You're all set " + data.name + "! <i class='thumbs up outline icon'></i>"
                notif.style.color = "green"
                this.waitForCheckin()
                return
            }
            // console.log(verified[i].claim.uportLiveEvent.identifier.did)
        }
        notif.innerHTML = "Sorry not an attendee <i class='exclamation icon'></i>"
        notif.style.color = "red"
        this.waitForCheckin()
    }

    render(){
        return (
            <main className="container">
                <div id="bodyContent" className="ui two column stackable grid">
                <div className="row">
                    <div className="six wide column">
                    <br></br><br></br>
                    <div onClick={this.returnDashboard} className="ui animated button" tabIndex="0">
                        <div className="visible content">Back</div>
                        <div className="hidden content">
                        <i className="left arrow icon"></i>
                        </div>
                    </div>
                    <h1>Check in</h1>
                    <h3>Share your attendance credential for the event and get access</h3>
                    <br></br>
                    <h2 id='verified'></h2>

                    </div>
                    <div className="ten wide column">
                        <img src={this.state.QR} />
                        {/* <button className="ui button" id="checkin" onClick={this.doCheckin} disabled={!eventData}>
                            <img className="uport-logo-icon" src={uPortLogo} alt="UPort Logo" />Check in with uPort
                        </button> */}
                        <h5>Share the URL with other organizers to verify attendees faster!</h5>
                    </div>
                </div>
                </div>
            </main>
        )
    }
}



export default VerifyEvent