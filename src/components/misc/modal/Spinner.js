import React from 'react'
import consensysLogo from '../../../img/consensys-logo.png'
import './Spinner.css'

/**
 * Consensys Hurricane spinner.  Spins.
 */
const Spinner = ({message}) => (
	<div className="spinner-wrapper">
    <em>{message}</em>
	  <img className="spinner" src={consensysLogo} alt="Just a moment..." />
	</div>
)

export default Spinner