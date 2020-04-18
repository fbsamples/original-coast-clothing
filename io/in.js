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

const Out = require("./out"),
  Order = require("../services/order"),
  API = require("../api/api"),
  Menu = require("../services/menu"),
  Survey = require("../survey/survey"),
  GraphAPi = require("../api/core/graph-api"),
  i18n = require("../i18n/i18n.config");

module.exports = class In {
  constructor(client, webhookEvent) {
    this.client = client;
    this.webhookEvent = webhookEvent;
  }

  triageMessage() {
    let event = this.webhookEvent;
    let message = event.message;
    let responses = null;

    try {
      if (event.message) {
        if (message.quick_reply) {
          responses = this.QuickReply();
        } else if (message.attachments) {
          // responses = this.GetAttachment();
        } else if (message.text) {
          responses = this.MessageIn();
        }
      } else if (event.postback) {
        responses = this.Postback();
      } else if (event.referral) {
        responses = this.Referral();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  MessageIn() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.client.psid}`
    );

    let event = this.webhookEvent
    let greeting = this.firstEntity(event.message.nlp, "greetings");
    let message = event.message.text.trim().toLowerCase();
    let response = null;
    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      response = API.genNuxMessage(this.client);
    } else if (Number(message)) {
      response = Order.handlePayload("ORDER_NUMBER");
    } else if (message.includes("#")) {
      response = Survey.handlePayload("CSAT_SUGGESTION");
    } else if (message.includes(i18n.__("care.help").toLowerCase())) {
      let menu = new Menu(this.client, event);
      response = menu.handlePayload("CARE_HELP");
    } else {
      // default handler
      response = [
        API.genText(
          i18n.__("fallback.any", {
            message: message
          })
        ),
        API.genText(i18n.__("get_started.guidance")),
        API.genQuickReply(i18n.__("get_started.help"), [
          {
            title: i18n.__("menu.suggestion"),
            payload: "CURATION"
          },
          {
            title: i18n.__("menu.help"),
            payload: "CARE_HELP"
          }
        ])
      ];
    }

    return response;
  }

  // Handles mesage events with attachments
  GetAttachment() {
    let response;

    // Get the attachment
    let attachment = this.webhookEvent.message.attachments[0];
    console.log("Received attachment:", `${attachment} for ${this.client.psid}`);

    response = API.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED"
      }
    ]);

    return response;
  }

  // Handles mesage events with quick replies
  QuickReply() {
    // Get the payload of the quick reply
    let payload = this.webhookEvent.message.quick_reply.payload;
    return this.handlePayload(payload);
  }

  // Handles postbacks events
  Postback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      // Get the payload of the postback
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  // Handles referral events
  Referral() {
    // Get the payload of the postback
    let payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.client.psid}`);

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.client.psid, payload);

    let response = null;

    // Set the response based on the payload
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = API.genNuxMessage(this.client);
    } else if (payload.includes("CURATION") || payload.includes("COUPON")) {
      let out = new Out(this.client, this.webhookEvent);
      response = out.handlePayload(payload);
    } else if (payload.includes("CARE")) {
      let menu = new Menu(this.client, this.webhookEvent);
      response = menu.handlePayload(payload);
    } else if (payload.includes("ORDER")) {
      response = Order.handlePayload(payload);
    } else if (payload.includes("CSAT")) {
      response = Survey.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        API.genText(i18n.__("chat_plugin.prompt")),
        API.genText(i18n.__("get_started.guidance")),
        API.genQuickReply(i18n.__("get_started.help"), [
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
        ])
      ];
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`
      };
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let welcomeMessage = i18n.__("get_started.welcome") + " " +
      i18n.__("get_started.guidance") + ". " +
      i18n.__("get_started.help");

    let response = API.genQuickReply(welcomeMessage, [
      {
        title: i18n.__("menu.suggestion"),
        payload: "CURATION"
      },
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP"
      }
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    };

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.client.psid
      },
      message: response
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.client.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
