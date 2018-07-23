/**
 * Actions and action creators for managing the modal
 * and spinner ui components
 */
export const SHOW_SPINNER = 'UI/SHOW_SPINNER'
export const SHOW_MODAL = 'UI/SHOW_MODAL'
export const CANCEL_MODAL = 'UI/CANCEL_MODAL'

export const showSpinner = (message) => ({
	type: SHOW_SPINNER,
  payload: message
})

export const showModal = (modalId, props) => ({
	type: SHOW_MODAL,
	payload: {modalId, props}
})

export const cancelModal = () => ({
	type: CANCEL_MODAL
})
