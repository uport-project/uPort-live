import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { eventsReducer } from '../components/events'
import { userReducer } from '../components/user'
import { modalReducer } from '../components/misc'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  events: eventsReducer,
  modal: modalReducer
})

export default reducer
