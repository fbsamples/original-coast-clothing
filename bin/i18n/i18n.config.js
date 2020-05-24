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

const i18n = require("i18n"),
  path = require("path");

i18n.configure({
  locales: [
    "en_US",
    // add here
  ],
  defaultLocale: "en_US",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  updateFiles: false,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;
