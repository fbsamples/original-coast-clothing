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
  //Survey = require("./survey"),
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
        var responses = [
          Response.genTextWithPersona(
            i18n.__("wholesale_leadgen.intro", {
              userFirstName: this.user.firstName,
              agentFirstName: config.personaOrder.name,
              topic: i18n.__("care.order")
            }),
            config.personaOrder.id
          ),
          Response.genTextWithPersona(
            i18n.__("care.end"),
            config.personaOrder.id
          )
        ];
        responses[0].delay = 4000;
        responses[1].delay = 6000;
        return responses;
      case "messenger_lead_gen_incomplete":
        return Response.genNuxMessage(this.user);
    }

    return;
  }
};
