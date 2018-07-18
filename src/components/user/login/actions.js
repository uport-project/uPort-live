import { browserHistory } from 'react-router'

import { createEvent } from '../../events'

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser(credentials) {
  return function(dispatch) {
    // Get current location and append login query
    const currentLocation = browserHistory.getCurrentLocation()
    dispatch(userLoggedIn(credentials))

    // HERE WE HACK OUT MOVING ATTESTATIONS TO THE RIGHT BRANCH
    const attestations = credentials.verified.map(({claim}) => claim.uportLiveEvent)
    dispatch(createEvent(attestations));

    // Used a manual redirect here as opposed to a wrapper.
    // This way, once logged in a user can still access the home page.
    if ('redirect' in currentLocation.query) {
      return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    return browserHistory.push('/dashboard')  
  }
}