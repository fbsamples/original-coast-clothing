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

module.exports = class Contact {
  constructor(client, webhookEvent) {
    this.client = client;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      
      case "CARE_HELP":
        response = API.genQuickReply(
          i18n.__("care.prompt", {
            userFirstName: this.client.f
          }),
          [
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
      
      case "CARE_ORDER":
        // Send using the Persona for order issues
        response = [
          API.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaOrder.name,
              topic: i18n.__("care.order")
            }),
            Config.personaOrder.id
          ),
          API.genTextWithPersona(
            i18n.__("care.end"),
            Config.personaOrder.id
          ),
          Survey.genAgentRating(Config.personaOrder.name)
        ];
        break;

      case "CARE_BILLING":
        // Send using the Persona for billing issues
        response = [
          API.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaBilling.name,
              topic: i18n.__("care.billing")
            }),
            Config.personaBilling.id
          ),
          API.genTextWithPersona(
            i18n.__("care.end"),
            Config.personaBilling.id
          ),
          Survey.genAgentRating(Config.personaBilling.name)
        ];
        break;

      case "CARE_SALES":
        // Send using the Persona for sales questions
        response = [
          API.genTextWithPersona(
            i18n.__("care.style", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaSales.name
            }),
            Config.personaSales.id
          ),
          API.genTextWithPersona(
            i18n.__("care.end"),
            Config.personaSales.id
          ),
          Survey.genAgentRating(Config.personaSales.name)
        ];
        break;

      case "CARE_OTHER":
        // Send using the Persona for customer care issues
        response = [
          API.genTextWithPersona(
            i18n.__("care.default", {
              userFirstName: this.client.f,
              agentFirstName: Config.personaCare.name
            }),
            Config.personaCare.id
          ),
          API.genTextWithPersona(
            i18n.__("care.end"),
            Config.personaCare.id
          ),
          Survey.genAgentRating(Config.personaCare.name)
        ];
        break;
    }

    return response;
  }
};
