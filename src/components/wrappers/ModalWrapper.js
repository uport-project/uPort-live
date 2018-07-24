import React from 'react'
import { connect } from 'react-redux'

import { Modal, whichModal } from '../misc'

/**
 * A Wrapper around the application, determining if a modal
 * should be displayed and which one
 */
const ModalWrapper = ({ modalId, modalProps, spinner, children }) => {
  const ModalContents = whichModal(modalId)
  
  return (
  	<React.Fragment>
      {(modalId || spinner) &&
        <Modal spinner={spinner}> 
          {spinner || <ModalContents {...modalProps} />}
        </Modal>
      }
      {children}
  	</React.Fragment>
  )
}

const mapStateToProps = (state, props) => ({
  modalId: state.modal.modalId,
  spinner: state.modal.spinner,
  modalProps: state.modal.props,
})

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalWrapper)