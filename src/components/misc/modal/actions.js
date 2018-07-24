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

/**
 * Return an action with a properly serializable modal id
 */
export const showModal = (modalId, props) => {
  if (typeof modalId !== 'string') {
    modalId = whichComponent(modalId)
  }

  return {
  	type: SHOW_MODAL,
  	payload: {modalId, props}
  }
}

export const cancelModal = () => ({
	type: CANCEL_MODAL
})


// Object mapping modal IDs to components
const ID_TO_COMPONENT = {}
const COMPONENT_TO_ID = {}


// Setter function for a modal id -> component and component -> id
export const registerModal = (id, component) => {
  if (id in ID_TO_COMPONENT) throw new Error('Modal id already registered')
  ID_TO_COMPONENT[id] = component
  COMPONENT_TO_ID[component] = id
}

// Getter function for component -> id (internal)
const whichComponent = (component) => COMPONENT_TO_ID[component]

// Getter for modal id -> comoponent
export const whichModal = (id) => ID_TO_COMPONENT[id]