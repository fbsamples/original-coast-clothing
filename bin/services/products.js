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

var imageMetaFromName = function(name, mod) {
  name = name.toLowerCase()
  let response = null
  switch (name) {
    case 'DEODORANTS':
      response = {
        'photos': ['lifestyle', 'cosmetical_info'],
        'more': ['product_info', 'cosmetical_ingredients'],
        'products': 'lifestyle_closeup'
      }
      break;

    default:
      response = {
        'photos': ['cosmetical_ingredients', 'cosmetical_info'],
        'more': ['product_info', 'cosmetical_ingredients'],
        'products': 'biocosmetical'
      }
      break;
  }

  return response[mod]
}

var photos = function(name) {
  let media = imageMetaFromName(name, 'photos')
  return [
    API.genImageTemplate(
      images[media[0]],
      i18n.__(`media.${media[0]}.title`),
      i18n.__(`media.${media[0]}.subtitle`)
    ),
    API.genImageTemplate(
      images[media[1]],
      i18n.__(`media.${media[1]}.title`),
      i18n.__(`media.${media[1]}.subtitle`)
    ),
    API.genQuickReply(i18n.__("products.follow"), [
      {
        title: i18n.__("features.ingredients"),
        payload: `FEATURES_${name}_INGREDIENTS`
      },
      {
        title: i18n.__("products.inquiry"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.buy"),
        payload: `ORDER_${name}`
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_SALES"
      }
    ])
  ]
}

var more = function(name) {
  let media = imageMetaFromName(name, 'more')
  return [
    API.genImageTemplate(
      images[media[0]],
      i18n.__(`media.${media[0]}.title`),
      i18n.__(`media.${media[0]}.subtitle`)
    ),
    API.genImageTemplate(
      images[media[1]],
      i18n.__(`media.${media[1]}.title`),
      i18n.__(`media.${media[1]}.subtitle`)
    ),
    API.genQuickReply(i18n.__("products.followup"), [
      {
        title: i18n.__("features.ingredients"),
        payload: `FEATURES_${name}_INGREDIENTS`
      },
      {
        title: i18n.__("products.buy"),
        payload: `ORDER_${name}`
      },
      {
        title: i18n.__("products.inquiry"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var products = function(name) {
  let media = imageMetaFromName(name, 'products')
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("products.overview.deodorants")),
    API.genQuickReply(i18n.__("products.follow"), [
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
        payload: `ORDER_${name}_BUY_NOW`
      },
      {
        title: i18n.__("products.back"),
        payload: "MENU"
      }
    ])
  ]
}

var info = function(name) {
  return API.genQuickReply(i18n.__("products.knowledge"), [
    {
      title: i18n.__("features.solventfree"),
      payload: `FEATURES_SOLVENT_FREE_${name}`
    },
    {
      title: i18n.__("features.benefits"),
      payload: `FEATURES_BENEFITS_${name}`
    },
    {
      title: i18n.__("features.toxicity"),
      payload: `FEATURES_LOW_TOXICITY_${name}`
    },
    {
      title: i18n.__("products.back"),
      payload: "ORDER_BUY_NOW"
    }
  ])
}

module.exports = class Products {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null

    switch (payload) {
      case "PRODUCTS_DEODORANTS":
        response = products("DEODORANTS")
        break;

      case "PRODUCTS_DEODORANTS_MORE_INFO":
        response = info("DEODORANTS")
        break;

      case "PRODUCTS_DEODORANTS_PHOTOS":
        response = photos("DEODORANTS")
        break;

      case "PRODUCTS_BIOCOSMETICALS_PHOTOS":
        response = photos("BIOCOSMETICALS")
        break;

      case "PRODUCTS_BIOCOSMETICALS":
        response = products("BIOCOSMETICALS")
        break;

      case "PRODUCTS_BIOCOSMETICALS_MORE_INFO":
        response = info("BIOCOSMETICALS")
        break;



      case "PRODUCTS_MORE_PHOTOS_DEODORANTS":
        response = more("DEODORANTS")
        break;

      case "PRODUCTS_MORE_PHOTOS_BIOCOSMETICALS":
        response = more("BIOCOSMETICALS")
        break;

    }

    return response;
  }
};
