/**
 * Copyright 2020, Cologne.Dog, Inc. All rights reserved.
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Builder by Cologne.Dog
 * https://www.messenger.com/t/colognedog
 */

"use strict"

const Out = require("./out"),
  API = require("../api/api"),
  GraphAPi = require("../api/core/graph-api"),
  i18n = require("../i18n/i18n.config");

module.exports = class In {
  constructor(client, webhookEvent) {
    this.client = client
    this.webhookEvent = webhookEvent
  }

  triageMessage() {
    let event = this.webhookEvent
    let message = event.message
    let response = null

    try {
      if (message) {
        if (message.quick_reply) {
          response = this.QuickReply()
        } else if (message.text) {
          response = this.MessageIn()
        }
      } else if (event.postback) {
        response = this.Postback()
      } else if (event.referral) {
        response = this.Referral()
      }
    } catch (error) {
      console.error(error)
      response = {
        text: "An error has occured. Please email us or try again!"
      }
    }

    if (Array.isArray(response)) {
      let delay = 0
      for (let resp of response) {
        this.sendMessage(resp, delay * 2000)
        delay++
      }
    } else {
      this.sendMessage(response)
    }
  }

  // Handles messages events with text
  MessageIn() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.client.psid}`
    )

    let event = this.webhookEvent
    let greeting = this.firstEntity(event.message.nlp, "greetings")
    let message = event.message.text.trim().toLowerCase()
    let response = null
    if (
      (greeting && greeting.confidence > 0.8) ||
      message.includes("start over")
    ) {
      // greeting detected
      response = this.handleGreetingReply(this.client)
    } else {
      // fallback to any
      response = this.handleFallbackReply(this.client, message)
    }

    return response
  }

  // Handles mesage with quick reply
  QuickReply() {
    let payload = this.webhookEvent.message.quick_reply.payload
    return this.handlePayload(payload)
  }

  // Handles postbacks events
  Postback() {
    let postback = this.webhookEvent.postback
    let payload = postback.payload
    return this.handlePayload(payload.toUpperCase())
  }

  // Get payload of the postback
  Referral() {
    let payload = this.webhookEvent.referral.ref.toUpperCase()
    return this.handlePayload(payload)
  }

  handlePayload(payload) {
    console.log("!!in:", `${payload} for ${this.client.psid}`)

    // Log CTA event in FBA
    GraphAPi.callFBAEventsAPI(this.client.psid, payload)

    let response = null
    let model = Out.Render

    response = new model(this.client, this.webhookEvent).handlePayload(payload)
    return response
  }

  sendWelcomeReply(type, object_id) {
    console.log('!!welcome!!')
    %%welcome%%

    let requestBody = {
      recipient: {
        [type]: object_id
      },
      message: response
    }

    GraphAPi.callSendAPI(requestBody)
  }

  handleGreetingReply(user) {
    console.log('!!greeting!!')
    %%greeting%%

    return response
  }

  handleFallbackReply(user, message) {
    console.log('!!fallback!!')
    %%fallback%%

    return response
  }

  sendMessage(response, delay=0) {
    if ("delay" in response) {
      delay = response["delay"]
      delete response["delay"]
    }

    let requestBody = {
      recipient: {
        id: this.client.psid
      },
      message: response
    };

    console.log(`!!out: ${JSON.stringify(requestBody)}`)

    // is there persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"]
      delete response["persona_id"]

      requestBody = {
        recipient: {
          id: this.client.psid
        },
        message: response,
        persona_id: persona_id
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay)
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0]
  }
};
