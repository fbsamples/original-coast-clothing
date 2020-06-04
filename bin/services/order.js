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

"use strict";

// Imports dependencies
const API = require("../api/api"),
  i18n = require("../i18n/i18n.config"),
  config = require("../config/config");

module.exports = class Order {

  handlePayload(payload) {
    let response = null

    switch (payload) {
      case "TRACK_ORDER":
        response = API.genQuickReply(i18n.__("order.prompt"), [
          {
            title: i18n.__("order.account"),
            payload: "LINK_ORDER"
          },
          {
            title: i18n.__("order.search"),
            payload: "SEARCH_ORDER"
          },
          {
            title: i18n.__("menu.help"),
            payload: "SUPPORT_ORDER"
          }
        ]);
        break;

      case "SEARCH_ORDER":
        response = API.genText(i18n.__("order.number"));
        break;

      case "ORDER_NUMBER":
        response = API.genImageTemplate(
          `${Config.appUrl}/order.png`,
          i18n.__("order.status")
        );
        break;

      case "LINK_ORDER":
        response = [
          API.genText(i18n.__("order.dialog")),
          API.genText(i18n.__("order.searching")),
          API.genImageTemplate(
            `${Config.appUrl}/order.png`,
            i18n.__("order.status")
          )
        ];
        break;

      case "ORDER_BUY_NOW":
      case "ORDER_DEODORANTS_BUY_NOW":
      case "ORDER_BIOCOSMETICALS_BUY_NOW":
        response = API.genGenericTemplate(
          `https://storage.needpix.com/rsynced_images/buy-now-2541975_1280.png`,
          i18n.__("menu.title"),
          i18n.__("menu.subtitle"),
          API.genWebButton()
        );
    }

    return response;
  }
};
