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

const Out = require("./out"),
  API = require("../api/api"),
  Config = require("../config/config"),
  Survey = require("../services/survey"),
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
    let response = null;

    try {
      if (message) {
        if (message.quick_reply) {
          response = this.QuickReply();
        } else if (message.attachments) {
          response = this.GetAttachment();
        } else if (message.text) {
          response = this.MessageIn();
        }
      } else if (event.postback) {
        response = this.Postback();
      } else if (event.referral) {
        response = this.Referral();
      }
    } catch (error) {
      console.error(error);
      response = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`
      };
    }

    if (Array.isArray(response)) {
      let delay = 0.01;
      for (let resp of response) {
        this.sendMessage(resp, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(response);
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
      let menu = new Out.Order(this.client, event);
      response = Order.handlePayload("ORDER_NUMBER");
    } else {
      // default handler
      response = [
        API.genText(
          i18n.__("fallback.any", {
            message: message
          })
        ),
        API.genQuickReply(i18n.__("menu.prompt"), [
          {
            title: i18n.__("menu.deodorants"),
            payload: "PRODUCTS_DEODORANTS"
          },
          {
            title: i18n.__("menu.biocosmeticals"),
            payload: "PRODUCTS_BIOCOSMETICALS"
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
        payload: "SUPPORT_HELP"
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
    } else {
      let model = null;
      if (payload.includes("MENU")) {
        model = Out.Menu
      } else if (payload.includes("SUPPORT")) {
        model = Out.Support
      } else if (payload.includes("PRODUCTS")) {
        model = Out.Products
      } else if (payload.includes("FEATURES")) {
        model = Out.Features
      } else if (payload.includes("ORDER")) {
        model = Out.Order
      } else if (payload.includes("CSAT")) {
        model = Out.Survey
      }

      if (model) {
        response = new model(
          this.client, this.webhookEvent).handlePayload(payload);
      } else {
        response = {
          text: `Could not compute message for payload: ${payload}!`
        };
      }
    }

    return response;
  }

  handlePrivateReply(type,object_id) {
    let response = API.genQuickReply(i18n.__("get_started.help"), [
        {
          title: i18n.__("menu.suggestion"),
          type: "postback",
          payload: "MENU"
        },
        {
          type: "web_url",
          title: i18n.__("products.buy"),
          url: Config.shopUrl,
          webview_height_ratio: "full"
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

  sendMessage(response, delay=0.03) {
    if (!response) return
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
