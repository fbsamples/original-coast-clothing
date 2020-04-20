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

module.exports = class Promo {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null
    
    switch (payload) {
      case "SUMMER_COUPON":
        response = [
          API.genText(
            i18n.__("leadgen.promo", {
              userFirstName: this.client.f
            })
          ),
          API.genGenericTemplate(
            `${Config.appUrl}/coupon.png`,
            i18n.__("leadgen.title"),
            i18n.__("leadgen.subtitle"),
            [API.genPostbackButton(i18n.__("leadgen.apply"), "COUPON_50")]
          )
        ];
        break;

      case "COUPON_50":
        outfit = `neutral-${this.randomOutfit()}`;
        response = [
          API.genText(i18n.__("leadgen.coupon")),
          API.genGenericTemplate(
            `${Config.appUrl}/styles/${outfit}.jpg`,
            i18n.__("menu.title"),
            i18n.__("menu.subtitle"),
            [
              API.genWebUrlButton(
                i18n.__("menu.shop"),
                `${Config.shopUrl}/products/${outfit}`
              ),
              API.genPostbackButton(
                i18n.__("menu.show"),
                "MENU_OTHER_STYLE"
              ),
              API.genPostbackButton(
                i18n.__("menu.sales"),
                "SUPPORT_SALES"
              )
            ]
          )
        ];
        break;
    }

    return response;
  }
};
