import React from 'react'
import consensysLogo from '../../../img/consensys-logo.png'
import './Spinner.css'

/**
 * Consensys Hurricane spinner.  Spins.
 */
const Spinner = () => (
	<div className="spinner-wrapper">
	  <img className="spinner" src={consensysLogo} />
	</div>
)

export default Spinner