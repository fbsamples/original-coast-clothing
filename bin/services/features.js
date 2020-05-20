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
  i18n = require("../i18n/i18n.config"),
  images = require("../config/images");

var imageMetaFromName = function(name) {
  name = name.toLowerCase()
  let response = null
  switch (name) {
    case 'DEODORANTS':
      response = 'lifestyle_closeup'
      break;

    default:
      response = 'cosmetical_highlight'
      break;
  }

  return response
}

var benefits = function(name) {
  let media = imageMetaFromName(name)
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("features.benefits2")),
    API.genText(i18n.__("features.benefits3")),
    API.genQuickReply(i18n.__("products.followup"), [
      {
        title: i18n.__("products.inquiry"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.photos"),
        payload: `PRODUCTS_${name}_PHOTOS`
      },
      {
        title: i18n.__("products.buy"),
        payload: `PRODUCTS_${name}_BUY_NOW`
      },
      {
        title: i18n.__("products.back"),
        payload: `PRODUCTS_${name}`
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var toxicity = function(name) {
  let media = imageMetaFromName(name)
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("features.benefits2")),
    API.genText(i18n.__("features.benefits3")),
    API.genQuickReply(i18n.__("products.followup"), [
      {
        title: i18n.__("products.inquiry"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.photos"),
        payload: `PRODUCTS_${name}_PHOTOS`
      },
      {
        title: i18n.__("products.buy"),
        payload: `PRODUCTS_${name}_BUY_NOW`
      },
      {
        title: i18n.__("products.back"),
        payload: `PRODUCTS_${name}`
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var solventFree = function(name) {
  let media = imageMetaFromName(name)
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("features.solventfree1")),
    API.genText(i18n.__("features.solventfree2")),
    API.genText(i18n.__("features.solventfree3")),
    API.genQuickReply(i18n.__("products.followup"), [
      {
        title: i18n.__("products.inquiry"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.photos"),
        payload: `PRODUCTS_${name}_PHOTOS`
      },
      {
        title: i18n.__("products.buy"),
        payload: `PRODUCTS_${name}_BUY_NOW`
      },
      {
        title: i18n.__("products.back"),
        payload: `PRODUCTS_${name}`
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
        response = benefits("DEODORANTS")
        break

      case "FEATURES_LOW_TOXICITY_DEODORANTS":
        response = toxicity("DEODORANTS")
        break

      case "FEATURES_BENEFITS_BIOCOSMETICALS":
        response = benefits("BIOCOSMETICALS")
        break

      case "FEATURES_LOW_TOXICITY_BIOCOSMETICALS":
        response = toxicity("BIOCOSMETICALS")
        break

      case "FEATURES_SOLVENT_FREE_DEODORANTS":
        response = solventFree("DEODORANTS")
        break

      case "FEATURES_SOLVENT_FREE_BIOCOSMETICALS":
        response = solventFree("BIOCOSMETICALS")
        break
      
    }

    return response;
  }
};
