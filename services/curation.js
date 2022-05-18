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
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    let outfit;

    switch (payload) {
      case "SUMMER_COUPON":
        response = [
          Response.genText(
            i18n.__("leadgen.promo", {
              userFirstName: this.user.firstName
            })
          ),
          Response.genGenericTemplate(
            `${config.appUrl}/coupon.png`,
            i18n.__("leadgen.title"),
            i18n.__("leadgen.subtitle"),
            [Response.genPostbackButton(i18n.__("leadgen.apply"), "COUPON_50")]
          )
        ];
        break;

      case "COUPON_50":
        outfit = `${this.user.gender}-${this.randomOutfit()}`;

        response = [
          Response.genText(i18n.__("leadgen.coupon")),
          Response.genGenericTemplate(
            `${config.appUrl}/looks/${outfit}.jpg`,
            i18n.__("curation.title"),
            i18n.__("curation.subtitle"),
            [
              Response.genWebUrlButton(
                i18n.__("curation.shop"),
                `${config.shopUrl}/products/${outfit}`
              ),
              Response.genPostbackButton(
                i18n.__("curation.show"),
                "CURATION_OTHER_STYLE"
              ),
              Response.genPostbackButton(
                i18n.__("curation.sales"),
                "CARE_SALES"
              )
            ]
          )
        ];
        break;

      case "CURATION":
        response = Response.genQuickReply(i18n.__("curation.prompt"), [
          {
            title: i18n.__("curation.me"),
            payload: "CURATION_FOR_ME"
          },
          {
            title: i18n.__("curation.someone"),
            payload: "CURATION_SOMEONE_ELSE"
          }
        ]);
        break;

      case "CURATION_FOR_ME":
      case "CURATION_SOMEONE_ELSE":
        response = Response.genQuickReply(i18n.__("curation.occasion"), [
          {
            title: i18n.__("curation.work"),
            payload: "CURATION_OCASION_WORK"
          },
          {
            title: i18n.__("curation.dinner"),
            payload: "CURATION_OCASION_DINNER"
          },
          {
            title: i18n.__("curation.party"),
            payload: "CURATION_OCASION_PARTY"
          },
          {
            title: i18n.__("curation.sales"),
            payload: "CARE_SALES"
          }
        ]);
        break;

      case "CURATION_OCASION_WORK":
        // Store the user budget preference here
        response = Response.genQuickReply(i18n.__("curation.price"), [
          {
            title: "~ $20",
            payload: "CURATION_BUDGET_20_WORK"
          },
          {
            title: "~ $30",
            payload: "CURATION_BUDGET_30_WORK"
          },
          {
            title: "+ $50",
            payload: "CURATION_BUDGET_50_WORK"
          }
        ]);
        break;

      case "CURATION_OCASION_DINNER":
        // Store the user budget preference here
        response = Response.genQuickReply(i18n.__("curation.price"), [
          {
            title: "~ $20",
            payload: "CURATION_BUDGET_20_DINNER"
          },
          {
            title: "~ $30",
            payload: "CURATION_BUDGET_30_DINNER"
          },
          {
            title: "+ $50",
            payload: "CURATION_BUDGET_50_DINNER"
          }
        ]);
        break;

      case "CURATION_OCASION_PARTY":
        // Store the user budget preference here
        response = Response.genQuickReply(i18n.__("curation.price"), [
          {
            title: "~ $20",
            payload: "CURATION_BUDGET_20_PARTY"
          },
          {
            title: "~ $30",
            payload: "CURATION_BUDGET_30_PARTY"
          },
          {
            title: "+ $50",
            payload: "CURATION_BUDGET_50_PARTY"
          }
        ]);
        break;

      case "CURATION_BUDGET_20_WORK":
      case "CURATION_BUDGET_30_WORK":
      case "CURATION_BUDGET_50_WORK":
      case "CURATION_BUDGET_20_DINNER":
      case "CURATION_BUDGET_30_DINNER":
      case "CURATION_BUDGET_50_DINNER":
      case "CURATION_BUDGET_20_PARTY":
      case "CURATION_BUDGET_30_PARTY":
      case "CURATION_BUDGET_50_PARTY":
        response = this.genCurationResponse(payload);
        break;

      case "CURATION_OTHER_STYLE":
        // Build the recommendation logic here
        outfit = `${this.user.gender}-${this.randomOutfit()}`;

        response = Response.genGenericTemplate(
          `${config.appUrl}/looks/${outfit}.jpg`,
          i18n.__("curation.title"),
          i18n.__("curation.subtitle"),
          [
            Response.genWebUrlButton(
              i18n.__("curation.shop"),
              `${config.shopUrl}/products/${outfit}`
            ),
            Response.genPostbackButton(
              i18n.__("curation.show"),
              "CURATION_OTHER_STYLE"
            )
          ]
        );
        break;
      case "PRODUCT_LAUNCH":
        // Build the recommendation logic here
        outfit = `${this.user.gender}-${this.randomOutfit()}`;
        response = Response.genRecurringNotificationsTemplate(
          `${config.appUrl}/looks/${outfit}.jpg`,
          i18n.__("curation.productLaunchTitle"),
          "WEEKLY",
          "12345"
        );
        break;
    }

    return response;
  }

  genCurationResponse(payload) {
    let occasion = payload.split("_")[3].toLowerCase();
    let budget = payload.split("_")[2].toLowerCase();
    let outfit = `${this.user.gender}-${occasion}`;

    let buttons = [
      Response.genWebUrlButton(
        i18n.__("curation.shop"),
        `${config.shopUrl}/products/${outfit}`
      ),
      Response.genPostbackButton(
        i18n.__("curation.show"),
        "CURATION_OTHER_STYLE"
      )
    ];

    if (budget === "50") {
      buttons.push(
        Response.genPostbackButton(i18n.__("curation.sales"), "CARE_SALES")
      );
    }

    let response = Response.genGenericTemplate(
      `${config.appUrl}/looks/${outfit}.jpg`,
      i18n.__("curation.title"),
      i18n.__("curation.subtitle"),
      buttons
    );

    return response;
  }

  randomOutfit() {
    let occasion = ["work", "party", "dinner"];
    let randomIndex = Math.floor(Math.random() * occasion.length);

    return occasion[randomIndex];
  }
};
