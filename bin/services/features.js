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
    case "DEODORANTS":
      response = {
        "benefits": "cosmetical_highlight",
        "toxicity": "product_detail",
        "solvents": "solvent_free"
      }
      break;

    default:
      response = {
        "benefits": "cosmetical_highlight",
        "toxicity": "product_detail",
        "solvents": "solvent_free"
      }
      break;
  }

  return response[mod]
}

var benefits = function(name) {
  let media = imageMetaFromName(name, "benefits")
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
        payload: "ORDER_BUY_NOW"
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var toxicity = function(name) {
  let media = imageMetaFromName(name, "toxicity")
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("features.toxicity1")),
    API.genText(i18n.__("features.toxicity2")),
    API.genText(i18n.__("features.toxicity3")),
    API.genText(i18n.__("features.toxicity4")),
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
        payload: "ORDER_BUY_NOW"
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var solvents = function(name, that) {
  let media = imageMetaFromName(name, "solvents")
  return [
    API.genImageTemplate(
      images[media],
      i18n.__(`media.${media}.title`),
      i18n.__(`media.${media}.subtitle`)
    ),
    API.genText(i18n.__("features.solventfree1", {
      userFirstName: that.user.firstName
    })),
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
        payload: "ORDER_BUY_NOW"
      },
      {
        title: i18n.__("products.back"),
        payload: `PRODUCTS_${name}_MORE_INFO`
      },
      {
        title: i18n.__("products.reset"),
        payload: "MENU"
      }
    ])
  ]
}

var ingredients = function(name) {
  return API.genQuickReply(i18n.__(`features.ingredients_${name.toLowerCase()}`), [
    {
      title: i18n.__("products.inquiry"),
      payload: `PRODUCTS_${name}_MORE_INFO`
    },
    {
      title: i18n.__("products.buy"),
      payload: `ORDER_${name}`
    },
    {
      title: i18n.__("products.reset"),
      payload: "MENU"
    },
    // {
    //   title: i18n.__("menu.help"),
    //   payload: "CARE_SALES"
    // }
  ])
}

module.exports = class Menu {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null

    switch (payload) {

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
        response = solvents("DEODORANTS", this)
        break

      case "FEATURES_SOLVENT_FREE_BIOCOSMETICALS":
        response = solvents("BIOCOSMETICALS", this)
        break

      case "FEATURES_DEODORANTS_INGREDIENTS":
        response = ingredients("DEODORANTS")
        break

      case "FEATURES_BIOCOSMETICALS_INGREDIENTS":
        response = ingredients("BIOCOSMETICALS")
        break

    }

    return response;
  }
};
