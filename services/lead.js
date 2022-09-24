/**
 * Copyright 2022-present, Facebook, Inc. All rights reserved.
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
  Receive = require("./receive"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Lead {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleHandover(metadata) {
    switch (metadata) {
      case "messenger_lead_gen_complete":
        return this.responseForLeadRef();
      case "messenger_lead_gen_incomplete":
        return Response.genNuxMessage(this.user);
    }

    return;
  }

  responseForLeadRef() {
    var responses = [
      Response.genTextWithPersona(
        i18n.__("wholesale_leadgen.intro", {
          userFirstName: this.user.firstName,
          agentFirstName: config.personaSales.name,
          topic: i18n.__("care.order")
        }),
        config.personaSales.id
      ),
      Response.genTextWithPersona(i18n.__("care.end"), config.personaSales.id)
    ];
    responses[0].delay = 4000;
    responses[1].delay = 6000;
    return responses;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "WHOLESALE_LEAD_AD":
        response = [
          Response.genText(
            i18n.__("wholesale_leadgen.lead_intro", {
              userFirstName: this.user.firstName
            })
          ),
          Response.genQuickReply(i18n.__("leadgen.lead_question"), [
            {
              title: i18n.__("common.yes"),
              payload: "WHOLESALE_LEAD_YES"
            },
            {
              title: i18n.__("common.no"),
              payload: "WHOLESALE_LEAD_NO"
            }
          ])
        ];
        break;

      case "WHOLESALE_LEAD_YES":
        new Receive(
          this.user,
          this.webhookEvent
        ).handleReportLeadSubmittedEvent();
        response = [Response.genText(i18n.__("leadgen.lead_qualified"))];
        response.concat(this.responseForLeadRef());
        break;

      case "WHOLESALE_LEAD_NO":
        response = [Response.genText(i18n.__("leadgen.lead_disqualified"))];
        response.concat(Response.genNuxMessage(this.user));
        break;
    }

    return response;
  }
};
