import Profile from './Profile'
import LoginModal from './login/LoginModal'
import LoginButton from './login/LoginButton'
import LogoutButton from './logout/LogoutButton'
import { 
  uport, 
  UserIsAuthenticated, UserIsNotAuthenticated, 
  HiddenOnlyAuth, VisibleOnlyAuth, firebaseApp 
} from './util'

import { loginUser } from './login/actions'
import { logoutUser } from './logout/actions'

import userReducer from './reducer'

/** Export Comopnents */
export { 
  Profile, LoginButton, LoginModal, LogoutButton,
  UserIsAuthenticated, UserIsNotAuthenticated, HiddenOnlyAuth, VisibleOnlyAuth
}

/** Export actions and reducer */
export { loginUser, logoutUser, userReducer, uport,firebaseApp }