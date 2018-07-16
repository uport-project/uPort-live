import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { QRUtil } from 'uport-connect'

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
    }
    componentDidMount() {
        const values = queryString.parse(this.props.location.search)
        console.log(values)
        this.setState({event:values.event})
    }

    verifyCred = (event) => {
        event.preventDefault()
        console.log(this.state.event)
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

    render(){
        return (
            <main className="container">
                <div id="bodyContent" className="ui two column stackable grid">
                <div className="row">
                    <div className="six wide column">
                    <br></br><br></br>
                    <button onClick={this.verifyCred}></button>
                    <div onClick={this.returnDashboard} className="ui animated button" tabIndex="0">
                        <div className="visible content">Back</div>
                        <div className="hidden content">
                        <i className="left arrow icon"></i>
                        </div>
                    </div>
                    <h1>Welcome to !</h1>
                    <h3>Use your uPort mobile application to check in and receive a Proof of Attendance credential</h3>
                    <h3>About the event </h3>

                    </div>
                    <div className="ten wide column">
                        {/* <img src={QR} />
                        <button className="ui button" id="checkin" onClick={this.doCheckin} disabled={!eventData}>
                            <img className="uport-logo-icon" src={uPortLogo} alt="UPort Logo" />Check in with uPort
                        </button> */}
                    </div>
                </div>
                </div>
            </main>
        )
    }
}



export default VerifyEvent