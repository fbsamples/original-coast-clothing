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

module.exports = class Products {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null

    switch (payload) {
      case "PRODUCTS_DEODORANTS":
        response = [
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/30mL_lifestyle00.JPG',
            '15mL Deodorant + Cleanser',
            'made with cold-pressed USDA certified organic essential oils'
          ),
          API.genText(i18n.__("products.deodorants.overview")),
          API.genQuickReply(i18n.__("products.follow"), [
            {
              title: i18n.__("products.inquiry"),
              payload: "DEODORANTS_MORE_INFO"
            },
            {
              title: i18n.__("products.photos"),
              payload: "DEODORANTS_PHOTOS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "DEODORANTS_BUY_NOW"
            },
            {
              title: i18n.__("products.back"),
              payload: "MENU"
            }
          ])
        ]
        break;

      case "PRODUCTS_DEODORANTS_MORE_INFO":
        break;

      case "PRODUCTS_DEODORANTS_PHOTOS":
        break;

      case "PRODUCTS_DEODORANTS_PHOTOS":
        break;

      case "PRODUCTS_BIOCOSMETICALS":
        break;
      
    }

    return response;
  }
};
