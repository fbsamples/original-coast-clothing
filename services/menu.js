/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Imports dependencies
const API = require("../api/api"),
  Survey = require("../survey/survey"),
  Config = require("../config/config"),
  i18n = require("../i18n/i18n.config");

module.exports = class Menu {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "GET_MENU":
        response = API.genQuickReply(
          i18n.__("care.prompt", {
            userFirstName: this.client.f
          }),
          [
            /*
              products
              buy now
              about us
              solvents
              ingredients
              contact us
            */
            {
              title: i18n.__("care.order"),
              payload: "CARE_ORDER"
            },
            {
              title: i18n.__("care.billing"),
              payload: "CARE_BILLING"
            },
            {
              title: i18n.__("care.other"),
              payload: "CARE_OTHER"
            }
          ]
        );
        break;
      
    }

    return response;
  }
};
