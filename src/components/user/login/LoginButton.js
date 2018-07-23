import React from 'react'
import { connect } from 'react-redux'

import { showModal, MODALS } from '../../misc'

/**
 * Simple login component, accepts a click handler function, extra styles for the button
 * element, and children to display inside of the button
 */
const LoginButton = ({style, children, showLoginModal}) => {
  return (
    <div className="login-container menu-item">
  		<button href="#" className="login-button" style={style} 
        onClick={showLoginModal}>
        {children}
      </button>
    </div>
  )
}

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch, props) => ({
  showLoginModal: () => dispatch(showModal(MODALS.Login))
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(LoginButton)