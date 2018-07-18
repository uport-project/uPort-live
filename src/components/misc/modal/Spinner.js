import React from 'react'
import { connect } from 'react-redux' 

import consensysLogo from '../../../img/consensys-logo.png'
import './Spinner.css'

/**
 * Consensys Hurricane spinner.  Spins.
 */
const Spinner = ({message}) => (
	<div className="spinner-wrapper">
    <em className="spinner-message">{message}</em>
	  <img className="spinner" src={consensysLogo} alt="Just a moment..." />
	</div>
)

const mapStateToProps = (state, props) => ({
  message: state.modal.props.message
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Spinner)