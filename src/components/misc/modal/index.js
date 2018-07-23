import Modal from './Modal'
import reducer from './reducer'
import { showSpinner, showModal, cancelModal } from './actions'

// Define available modal ids
const MODALS = {
  Login: 'LOGIN',
  QR: 'QR',
  Verify: 'VERIFY'
}

export { Modal, MODALS, showSpinner, showModal, cancelModal, reducer }