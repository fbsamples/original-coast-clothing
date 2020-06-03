/**
 * Copyright 2020, Cologne.Dog, Inc. All rights reserved.
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Cologne.Dog
 * https://www.messenger.com/t/colognedog
 */

const assert = require('assert')
const i18n = require("../bin/i18n/i18n.config.js")

function testLocales(cb) {
	let l1 = 'fr_FR'
	let l2 = 'en_US'
	i18n.setLocale(l1)
	let _l1 = i18n.getLocale()
	assert(l1 !== _l1)
	i18n.setLocale(l2)
	let _l2 = i18n.getLocale()
	assert(l2 === _l2)
	cb()
}

function async(arg) {
	if (arg) {
		arg(function(e) {
			if (e) process.exit(1)
			async(tests.shift())
		})
	} else {
		console.log('all tests passed!')
		process.exit(0)
	}
}

let tests = [
	testLocales
]

async(tests.shift())

