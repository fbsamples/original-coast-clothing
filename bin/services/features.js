/**
 * Copyright 2020, Cologne.Dog, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Cologne.Dog
 * https://www.messenger.com/t/colognedog
 */

"use strict";

// Imports dependencies
const API = require("../api/api"),
  Config = require("../config/config"),
  i18n = require("../i18n/i18n.config");

var benefits = function(name) {
  return [
    API.genImageTemplate(
      'https://dftxjilcwnuew.cloudfront.net/public/cosmeticals_highlight.png',
      i18n.__("media.cosmeticals_highlight_0"),
      i18n.__("media.cosmeticals_highlight_1")
    ),
    API.genText(i18n.__("features.benefits2")),
    API.genText(i18n.__("features.benefits3")),
    API.genQuickReply(i18n.__("products.followup"), [
      {
        title: i18n.__("products.inquiry"),
        payload: "PRODUCTS_BIOCOSMETICALS_MORE_INFO"
      },
      {
        title: i18n.__("products.photos"),
        payload: "PRODUCTS_BIOCOSMETICALS_PHOTOS"
      },
      {
        title: i18n.__("products.buy"),
        payload: "PRODUCTS_BIOCOSMETICALS_BUY_NOW"
      },
      {
        title: i18n.__("products.back"),
        payload: name
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

module.exports = class Menu {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null

    switch (payload) {
      case "FEATURES_DEODORANTS_INGREDIENTS":
        response = API.genText(i18n.__("products.ingredients.deodorant"))
        break

      case "FEATURES_BENEFITS_DEODORANTS":
        response = benefits("PRODUCTS_DEODORANTS")
        break

      case "FEATURES_BENEFITS_BIOCOSMETICALS":
        response = benefits("PRODUCTS_BIOCOSMETICALS")
        break

      case "SOLVENTFREE_INFO":
        break
      
    }

    return response;
  }
};
