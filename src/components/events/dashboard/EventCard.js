import React, { Component } from 'react'
import moment from 'moment'

import './EventCard.css'

/**
 * @classdesc
 * A component for displaying a single event on the user's dashboard
 * Each event will be pulled from the user's attestations that are requested at login
 *
 * TODO: Clicking on an event card will launch the attendance attestation flow for the
 *       clicked event
 */
const EventCard = ({beginCheckin, isActive, ...eventData}) => {
  // Build the function to launch the checkin flow for this particular event
  const checkin = (event) => {
    event.preventDefault()
    beginCheckin(eventData)
  }

  // Extract event data for display
  let {name, location, about, description, startDate, endDate, image} = eventData

  // HAack to allow about or description
  description = description || about

  const dateRange = formatDateRange(startDate, endDate)

  // Don't shorten empty description
  const shortDesc = description && shortenDescription(description)

	return (
    <div className="ui card">
      <div className="content">
        <div className="header">{name}</div>
        <div className="meta">{dateRange}</div>
        <div className="meta">{location}</div>
        <hr/>
        <div className="description">
          <p>{shortDesc}</p>
        </div>
        <div className="image-box">
        {image && <img className="card-image" src={image} alt="Event Icon" />}
        </div>
      </div>
      {isActive && (
        <div className="ui bottom attached button" onClick={checkin}>
          <i className="add icon"></i>Check in
        </div>
      )}
    </div>
	)
}

/**
 * Shorten long event descriptions to a standard size
 * @param {String} desc -- description of event
 */
function shortenDescription(desc, length=150) {
  if (desc.length <= length) {
    return desc
  }

  // trim the string to the maximum length
  let trimmedString = desc.substr(0, length);

  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

  return trimmedString + "..."
}

/**
 * Format a date range, only repeating fields that are different between the
 * start and end date.  Use 3-letter abbrevs for months, normal numbers for 
 * days, and full years.
 * @param {String} start -- ISO date string for start date/time
 * @param {String} end   -- ISO date string for end date/time
 */
function formatDateRange(start, end) {
  // Use moment for convenient parsing
  start = moment(start)
  end = moment(end)

  // See which fields need to be redisplayed accross start and end date
  if (start.isSame(end, 'day'))
    return start.format('MMM D, YYYY')
  if (start.isSame(end, 'month'))
    return `${start.format('MMM D')}-${end.format('D, YYYY')}`
  if (start.isSame(end, 'year'))
    return `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`

  return `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`
}

export default EventCard