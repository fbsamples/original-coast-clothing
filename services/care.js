/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

// Imports dependencies
const Response = require("./response"),
  Survey = require("./survey"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Care {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "CARE_HELP":
        response = Response.genQuickReply(
          i18n.__("care.prompt", {
            userFirstName: this.user.firstName
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
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaOrder.name,
              topic: i18n.__("care.order")
            }),
            config.personaOrder.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaOrder.id
          ),
          Survey.genAgentRating(config.personaOrder.name)
        ];
        break;

      case "CARE_BILLING":
        // Send using the Persona for billing issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.issue", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaBilling.name,
              topic: i18n.__("care.billing")
            }),
            config.personaBilling.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaBilling.id
          ),
          Survey.genAgentRating(config.personaBilling.name)
        ];
        break;

      case "CARE_SALES":
        // Send using the Persona for sales questions

        response = [
          Response.genTextWithPersona(
            i18n.__("care.style", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaSales.name
            }),
            config.personaSales.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaSales.id
          ),
          Survey.genAgentRating(config.personaSales.name)
        ];
        break;

      case "CARE_OTHER":
        // Send using the Persona for customer care issues

        response = [
          Response.genTextWithPersona(
            i18n.__("care.default", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaCare.name
            }),
            config.personaCare.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaCare.id
          ),
          Survey.genAgentRating(config.personaCare.name)
        ];
        break;
    }

    return response;
  }
};
