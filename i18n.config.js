/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

const i18n = require("i18n"),
  path = require("path");

i18n.configure({
  locales: ["en_US", "fr_FR", "es_ES", "es_LA", "pt_BR", "id_ID"],
  defaultLocale: "en_ES",
  directory: path.join(__dirname, "locales"),
  objectNotation: true,
  api: {
    __: "translate",
    __n: "translateN"
  }
});

module.exports = i18n;
