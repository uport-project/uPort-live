import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'

import EventCard from './EventCard'
import { beginCheckin } from '../checkin'

/**
 * @classdesc
 * This component will display all of a user's own events
 */
class Dashboard extends Component {
  handleCreateEvent() {
    browserHistory.push("/create")
  }

  render() {
    const { ownEvents, beginCheckin, authData } = this.props
    const { activeEvents, pastEvents } = sortEvents(ownEvents)
    
    return (
      <main className="container">
        <div id="bodyContent" className="fullpage">
          <h2>Welcome, {authData.name}!</h2>
          <button className="navButton" onClick={this.handleCreateEvent}>Create New Event</button>
          <br></br>
          <h3> Active Events </h3>
          <em>Click an event card to check in attendees!</em><br></br><br></br>
          <div className="ui three stackable cards">
          {activeEvents.map((eventDetails, idx) =>
            <EventCard beginCheckin={beginCheckin} isActive={true} key={`${eventDetails.name}-${idx}`} {...eventDetails} />
          )}
          </div>

          <h3> Past Events</h3>
          <div className="ui three stackable cards">
          {pastEvents.map((eventDetails, idx) =>
            <EventCard beginCheckin={beginCheckin} isActive={false} key={`${eventDetails.name}-${idx}`} {...eventDetails} />
          )}
          </div>
        </div>
      </main>
    )
  }
}

/**
 * Return two lists of events, separated by whether the endDate
 * is before today.  Each list is sorted by startDate
 */
function sortEvents(events) {
  const today = moment().startOf('day')
  const activeEvents = []
  const pastEvents = []

  // Split by active/past
  for (const e of events) {
    if (moment(e.endDate).isSameOrAfter(today))
      activeEvents.push(e)
    else
      pastEvents.push(e)
  }

  // Sort each category by start date
  const sorter = (a, b) => {
    a = moment(a.startDate)
    b = moment(b.startDate)
    return a.isBefore(b) ? 1 : a.isAfter(b) ? -1 : 0
  }

  activeEvents.sort(sorter)
  pastEvents.sort(sorter)

  return {activeEvents, pastEvents}
}

// Connect dashboard to checkin flow
const mapStateToProps = (state, ownProps) => ({
  ownEvents: state.events.ownEvents
})

const mapDispatchToProps = (dispatch) => ({
  beginCheckin: (eventData) => {
    dispatch(beginCheckin(eventData))
  } 
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Dashboard)
