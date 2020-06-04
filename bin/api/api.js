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

const i18n = require("../i18n/i18n.config");

module.exports = class API {

  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: []
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"]
      });
    }

    console.log('genQuickReply output')
    console.log(response)

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons
            }
          ]
        }
      }
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url
            }
          ]
        }
      }
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons
        }
      }
    };

    return response;
  }

  // text response from input request
  static genText(text) {
    let response = {
      text: text
    };
    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true,
      webview_height_ratio: 'compact'
    };

    return response;
  }

  static genWebButton() {
    return [
      API.genWebUrlButton(
        i18n.__("menu.shop"),
        `https://cologne.dog/products`
      )
    ]
  }

  static genNuxMessage(user) {
    console.log('in genNuxMessage')
    return [
      this.genText(
        i18n.__("get_started.welcome", {
          userFirstName: user.firstName
        })
      ),
      this.genQuickReply(i18n.__("get_started.guidance"), [
        {
          title: i18n.__("menu.suggestion"),
          payload: "MENU"
        },
        {
          title: i18n.__("products.buy"),
          payload: "ORDER_BUY_NOW"
        }
      ])
    ]
  }
};
