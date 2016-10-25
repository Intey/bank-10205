import $ from 'jquery'

/**
 * Getting event id from rendered page. Getting from attribute data-id, that
 * filled from server. Tag #event not a part of React, it's just template, so
 * use this hack.
 * Look at template ../../../../templates/banking/event.jade
 */
export default function eventId() {
  return $('#event').attr('data-id')
}

