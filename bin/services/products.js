/**
 * Copyright 2020, Cologne.Dog, Inc. All rights reserved.
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
  Config = require("../config/config"),
  i18n = require("../i18n/i18n.config"),
  images = require("../config/images");

module.exports = class Products {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response = null

    switch (payload) {
      case "PRODUCTS_DEODORANTS":
        response = [
          API.genImageTemplate(
            images.lifestyle_closeup,
            i18n.__("media.lifestyle_closeup.title"),
            i18n.__("media.lifestyle_closeup.subtitle")
          ),
          API.genText(i18n.__("products.overview.deodorants")),
          API.genQuickReply(i18n.__("products.follow"), [
            {
              title: i18n.__("products.inquiry"),
              payload: "PRODUCTS_DEODORANTS_MORE_INFO"
            },
            {
              title: i18n.__("products.photos"),
              payload: "PRODUCTS_DEODORANTS_PHOTOS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "ORDER_DEODORANTS_BUY_NOW"
            },
            {
              title: i18n.__("products.back"),
              payload: "MENU"
            }
          ])
        ]
        break;

      case "PRODUCTS_DEODORANTS_MORE_INFO":
        response = [
          API.genQuickReply(i18n.__("products.knowledge"), [
            {
              title: i18n.__("features.solventfree"),
              payload: "FEATURES_SOLVENT_FREE_DEODORANTS"
            },
            {
              title: i18n.__("features.benefits"),
              payload: "FEATURES_BENEFITS_DEODORANTS"
            },
            {
              title: i18n.__("features.toxicity"),
              payload: "FEATURES_LOW_TOXICITY_DEODORANTS"
            },
            {
              title: i18n.__("products.back"),
              payload: "ORDER_BUY_NOW"
            }
          ])
        ]
        break;

      case "PRODUCTS_DEODORANTS_PHOTOS":
        response = [
          API.genImageTemplate(
            images.lifestyle,
            i18n.__("media.lifestyle.title"),
            i18n.__("media.lifestyle.subtitle")
          ),
          API.genImageTemplate(
            images.product_detail,
            i18n.__("media.product_detail.title"),
            i18n.__("media.product_detail.subtitle")
          ),
          API.genQuickReply(i18n.__("products.follow"), [
            {
              title: i18n.__("features.ingredients.deodorants"),
              payload: "FEATURES_DEODORANTS_INGREDIENTS"
            },
            {
              title: i18n.__("features.benefits"),
              payload: "FEATURES_BENEFITS_DEODORANTS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "ORDER_BUY_NOW"
            },
            {
              title: i18n.__("menu.help"),
              payload: "CARE_SALES"
            }
          ])
        ]
        break;

      case "PRODUCTS_BIOCOSMETICALS":
        response = [
          API.genImageTemplate(
            images.biocosmetical,
            i18n.__("media.biocosmetical.title"),
            i18n.__("media.biocosmetical.subtitle")
          ),
          API.genText(i18n.__("products.cosmeticals")),
          API.genQuickReply(i18n.__("products.follow"), [
            {
              title: i18n.__("products.inquiry"),
              payload: "PRODUCTS_BIOCOSMETICALS_MORE_INFO"
            },
            {
              title: i18n.__("products.photos"),
              payload: "PRODUCTS_BIOCOSMETICALS_PHOTOS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "PRODUCTS_BIOCOSMETICALS_BUY_NOW"
            },
            {
              title: i18n.__("products.back"),
              payload: "MENU"
            }
          ])
        ]
        break;

      case "PRODUCTS_BIOCOSMETICALS_MORE_INFO":
        response = [
          API.genText(i18n.__("products.cosmeticals.explainer1")),
          API.genText(i18n.__("products.cosmeticals.explainer2")),
          API.genText(i18n.__("products.cosmeticals.explainer3")),
          API.genText(i18n.__("products.cosmeticals.explainer4")),
          API.genQuickReply(i18n.__("products.followup"), [
            {
              title: i18n.__("products.more_photos"),
              payload: "FEATURES_SOLVENT_FREE_BIOCOSMETICALS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "FEATURES_BENEFITS_BIOCOSMETICALS"
            },
            {
              title: i18n.__("features.toxicity"),
              payload: "FEATURES_LOW_TOXICITY_BIOCOSMETICALS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "PRODUCTS_BIOCOSMETICALS_BUY_NOW"
            }
          ])
        ]
        break;

      case "PRODUCTS_BIOCOSMETICALS_PHOTOS":
        response = [
          API.genImageTemplate(
            images.cosmetical_highlight,
            i18n.__("media.cosmetical_aux.title"),
            i18n.__("media.cosmetical_aux.subtitle")
          ),
          API.genImageTemplate(
            images.cosmetical_info,
            i18n.__("media.cosmetical_info.title"),
            i18n.__("media.cosmetical_info.subtitle")
          ),
          API.genImageTemplate(
            images.cosmetical_ingredients,
            i18n.__("media.cosmetical_ingredients.title"),
            i18n.__("media.cosmetical_ingredients.subtitle")
          ),
          API.genQuickReply(i18n.__("products.followup"), [
            {
              title: i18n.__("products.more_photos"),
              payload: "FEATURES_SOLVENT_FREE_BIOCOSMETICALS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "FEATURES_BENEFITS_BIOCOSMETICALS"
            },
            {
              title: i18n.__("products.buy"),
              payload: "PRODUCTS_BIOCOSMETICALS_BUY_NOW"
            }
          ])
        ]
        break;
      
      case "PRODUCTS_BIOCOSMETICALS_BUY_NOW":
        break;

    }

    return response;
  }
};
