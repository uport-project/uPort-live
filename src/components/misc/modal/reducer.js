import { LOCATION_CHANGE } from 'react-router-redux'

import { SHOW_MODAL, SHOW_SPINNER, CANCEL_MODAL } from './actions'

const defaultState = {
  spinner: false,
  modalId: null,
  props: {},
}

const reducer = (state = defaultState, {payload, type}) => {
  switch (type) {
    // Cancel modal after explicit cancel or any navigation event
    case LOCATION_CHANGE:
    case CANCEL_MODAL:
      return defaultState
    case SHOW_MODAL:
      const {modalId, props} = payload
      return {
        spinner: false,
        modalId, props
      }
    case SHOW_SPINNER:
      return {
        spinner: true,
        modalId: null, 
        props: {}
      }
    default:
      return state
  }
}

export default reducer