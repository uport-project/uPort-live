import React from 'react'
import { connect } from 'react-redux'

import Spinner from './Spinner'
import { cancelModal } from './actions'

import './Modal.css'

/**
 * A general wrapper for a modal dialog and blocking spinner
 * The modal/spinner can be triggered by the showModal() and showSpinner()
 * actions defined in ./actions, and is cancelled by cancelModal()
 */
const Modal = ({spinner, cancel, children}) => (
  <div className="modal fade-in" onClick={cancel}>
    {spinner ? (
      <Spinner />
    ) : (
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cancel" onClick={cancel}>x</button>
        {children}
      </div>
    )}
  </div>
)


const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = (dispatch, props) => ({
  cancel: () => dispatch(cancelModal())
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Modal)