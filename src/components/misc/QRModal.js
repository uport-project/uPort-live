import React from 'react'
import { QRUtil } from 'uport-connect'
import { registerModal } from './modal'

const DEFAULT_MESSAGE = 'Scan the QR code below with your uPort mobile app'

/**
 * Genearl component for displaying a QR with a message,
 * Very similar to the
 */
const QRModal = ({uri, message=DEFAULT_MESSAGE}) => {
	const QR = QRUtil.getQRDataURI(uri)
	return (
		<div className="qr-display">
			<h4>{message}</h4>
			<img src={QR} alt={message}/>
		</div>
	)
}

// Register QR modal component
registerModal('QRModal', QRModal)

export default QRModal