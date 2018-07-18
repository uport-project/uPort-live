import React from 'react'
import { QRUtil } from 'uport-connect'

const MESSAGE = 'Scan the QR code below with your uPort mobile app'

/**
 * Genearl component for displaying a QR with a message,
 * Very similar to the
 */
const QRModal = ({uri, message=MESSAGE, appName='This Dapp'}) => {
	const QR = QRUtil.getQRDataURI(uri)

	return (
		<div className="qr-display">
      <h2>Receive attestation from <span className="purple">{appName}</span></h2>
			<h4>{message}</h4>
			<img src={QR} alt={message}/>
		</div>
	)
}

export default QRModal