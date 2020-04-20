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
  Survey = require("./survey"),
  Config = require("../config/config"),
  i18n = require("../i18n/i18n.config");

module.exports = class Contact {
  constructor(client, webhookEvent) {
    this.client = client;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null;

    switch (payload) {
      
      case "SUPPORT_HELP":
        response = API.genQuickReply(
          i18n.__("support.prompt", {
            userFirstName: this.client.f
          }),
          [
            {
              title: i18n.__("support.order"),
              payload: "SUPPORT_ORDER"
            },
            {
              title: i18n.__("support.billing"),
              payload: "SUPPORT_BILLING"
            },
            {
              title: i18n.__("support.other"),
              payload: "SUPPORT_OTHER"
            }
          ]
        );
        break;
      
      case "SUPPORT_ORDER":
        // Send using the Persona for order issues
        response = [
          API.genTextWithPersona(
            i18n.__("support.issue", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaOrder.name,
              topic: i18n.__("support.order")
            }),
            Config.personaOrder.id
          ),
          API.genTextWithPersona(
            i18n.__("support.end"),
            Config.personaOrder.id
          ),
          Survey.genAgentRating(Config.personaOrder.name)
        ];
        break;

      case "SUPPORT_BILLING":
        // Send using the Persona for billing issues
        response = [
          API.genTextWithPersona(
            i18n.__("support.issue", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaBilling.name,
              topic: i18n.__("support.billing")
            }),
            Config.personaBilling.id
          ),
          API.genTextWithPersona(
            i18n.__("support.end"),
            Config.personaBilling.id
          ),
          Survey.genAgentRating(Config.personaBilling.name)
        ];
        break;

      case "SUPPORT_SALES":
        // Send using the Persona for sales questions
        response = [
          API.genTextWithPersona(
            i18n.__("support.style", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaSales.name
            }),
            Config.personaSales.id
          ),
          API.genTextWithPersona(
            i18n.__("support.end"),
            Config.personaSales.id
          ),
          Survey.genAgentRating(Config.personaSales.name)
        ];
        break;

      case "SUPPORT_OTHER":
        // Send using the Persona for customer care issues
        response = [
          API.genTextWithPersona(
            i18n.__("support.default", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaCare.name
            }),
            Config.personaCare.id
          ),
          API.genTextWithPersona(
            i18n.__("support.end"),
            Config.personaCare.id
          ),
          Survey.genAgentRating(Config.personaCare.name)
        ];
        break;
    }

    return response;
  }
};
