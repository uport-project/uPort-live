import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { QRUtil } from 'uport-connect'
import { uport } from '../../user/util'

import queryString from 'query-string'
import {verifyJWT} from 'did-jwt'

/**
 * @classdesc
 * A component for verifying event did of a user
 *
 */
// const VerifyEvent = ({did}) => {
class EventVerifier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            QR: null,
            event: ""
        }

        this.doVerify = this.doVerify.bind(this)
        this.updateQR = this.updateQR.bind(this)
    }
    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        this.setState({event:values.event})
        this.createEventIdentity(this.props)
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
        this.waitForVerify = () => {
          uport.requestCredentials(
            { requested:['name'], verified: ['uportLiveAttendance'] }, 
            this.updateQR
          ).then((data) => {
            this.doVerify(data)
          })
        }
    
        this.waitForVerify()
      }


    //verified[i].sub == data.address
    doVerify ({verified}) {
        const { event } = this.state
        // TODO: Change conditional react display
        // let notif = document.getElementById('verified')
        for (var i = 0; i < verified.length; i++) {
            const { signature } = verified[i].claim.uportLiveAttendance
            if (signature) {
                verifyJWT(signature).then(obj => {
                    console.log(obj)
                    // CHECK FOR VALID Attendee field

                    // notif.innerHTML = "You're all set " + data.name + "! <i class='thumbs up outline icon'></i>"
                    // notif.style.color = "green"
                    // this.waitForCheckin()
                    // notif.innerHTML = "Sorry not an attendee <i class='exclamation icon'></i>"
                    // notif.style.color = "red"
                    this.waitForVerify()
                    return
                })
            } else if (verified[i].iss === event) {
                // ALSO SUCCESS
                console.log('New style credential, signed by event')
                console.log(verified[i])
            }
        }

        // FAILURE

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



export default EventVerifier