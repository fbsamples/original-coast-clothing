/**
 * Copyright 2020, Cologne.Dog, Inc. All rights reserved.
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Builder by Cologne.Dog
 * https://www.messenger.com/t/colognedog
 */

const Config = require("../config/config")
const enum = ['navigation', 'info', 'image', 'web']
var destinations = []

/*

Create navigation, these are placeholders that define
the user flow and experience of the application. Create
as many destinations as you like. Once you create a destination
it becomes available to select for the options displayed in 
other destinations:

	default destinations:
		hello page
		fallback page

	user created destinations:
		title: string (no spaces allowed)
*/

const addDestination = function(destinationName) {
	destinationName = destinationName.toUpperCase()
	if (destinations.indexOf(destinationName) === -1) {
		destinations.push(destinationName)
	}
}

/*

Display options for destinations. For each destination you will define
what is displayed in what order, and prompt the user to make one or
more actions with one or more options made available to the user.

You may select display options from the `enum` available:
- destination: redirect user to another destination
- info: display text
- photo: display one photo with optional title and optional subtitle
- web: display webpage for user interactions

*/

const imageOpts = function(url, title, subtitle) {
	return {
		url: url,
		title: title || null,
		subtitle: subtitle || null,
	}
}

const infoOpts = function(title, text) {
	return {
		title: title,
		text: text
	}
}

const navigationOpts = function(title, destination) {
	return {
		title: title,
		destination: destination
	}
}

const webOpts = function(path, title, subtitle) {
	let url = `${Config.shopUrl}/${path}`
	return {
		url: url,
		title: title || null,
		subtitle: subtitle || null,
	}
}

const createDisplay = function(type, options) {
	switch(type) {
		case 'image':
			imageButton(options)
			break

		case 'info':
			infoButton(options)
			break

		case 'navigation':
			navigationButton(options)
			break

		case 'web':
			webButton(options)
			break

		default:
			break
	}
}

const imageButton = function(options) {

}

const infoButton = function(options) {
	
}

const navigationButton = function(options) {
	
}

const webButton = function(options) {
	
}





