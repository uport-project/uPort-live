import { uploadToIpfs } from './util/ipfs'
import QRModal from './QRModal'
import { Modal, whichModal, registerModal, showSpinner, showModal, cancelModal, reducer as modalReducer } from './modal'

export { Modal, whichModal, registerModal, QRModal, showSpinner, showModal, cancelModal, modalReducer, uploadToIpfs }