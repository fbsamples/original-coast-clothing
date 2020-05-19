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
  i18n = require("../i18n/i18n.config");

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
            'https://dftxjilcwnuew.cloudfront.net/public/15mL_lifestyle_closeup.JPG',
            '15mL Deodorant + Cleanser',
            'made with cold-pressed USDA certified organic essential oils'
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
              payload: "FEATURES_SOLVENT_FREE"
            },
            {
              title: i18n.__("features.benefits"),
              payload: "FEATURES_BENEFITS_DEODORANTS"
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
            'https://dftxjilcwnuew.cloudfront.net/public/15mL_lifestyle00.JPG',
            'Made for dogs, loved by humans™',
            'it all started by helping a dog friend who was stinky and felt bad about it'
          ),
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/deodorants_photo_about.png',
            'Deodorant + Cleanser + Vitamins',
            'so effective'
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
            'https://dftxjilcwnuew.cloudfront.net/public/biocosmetical_closeup.jpg',
            '10mL Vegan Stem Cell Serum Perfume',
            'designed to optimize endogenous collagen synthesis for healthy skin'
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
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/cosmeticals_highlight.png',
            'Micronutrients in Cologne.Dog™ nanoemulsion',
            'contains vitamins, carotenoids, flavonoids, peptides, and more'
          ),
          API.genText(i18n.__("products.cosmeticals.explainer2")),
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/cosmeticals_info.png',
            'Support essential stem cell functions',
            'the key to healthy skin and tissues is the maintenance of their stem cells'
          ),
          API.genText(i18n.__("products.cosmeticals.explainer3")),
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/cosmeticals_ingredients.png',
            'World\'s highest quality essential oils',
            'vegan skin stem cell perfume provides all-natural vegan benefits'
          ),
          API.genText(i18n.__("products.cosmeticals.explainer4")),
          API.genQuickReply(i18n.__("products.followup"), [
            {
              title: i18n.__("products.more_photos"),
              payload: "FEATURES_SOLVENT_FREE"
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

      case "PRODUCTS_BIOCOSMETICALS_PHOTOS":
        response = [
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/15mL_lifestyle00.JPG',
            'Made for dogs, loved by humans™',
            'it all started by helping a friend with a smell problem'
          ),
          API.genImageTemplate(
            'https://dftxjilcwnuew.cloudfront.net/public/deodorants_photo_about.png',
            '15mL Deodorant + Cleanser',
            'our solvent-free solutions open a new world of benefits'
          ),
          API.genQuickReply(i18n.__("products.follow"), [
            {
              title: i18n.__("products.more_photos"),
              payload: "FEATURES_SOLVENT_FREE"
            },
            {
              title: i18n.__("products.buy"),
              payload: "FEATURES_BENEFITS_BIOCOSMETICALS"
            },
            {
              title: i18n.__("products.back"),
              payload: "ORDER_BUY_NOW"
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
