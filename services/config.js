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

// Use dotenv to read .env vars into Node
const config = require("dotenv").config();

module.exports = {
  // Messenger Platform API
  mPlatformDomain: "https://graph.facebook.com",
  mPlatformVersion: "v3.2",

  // Page and Application information
  pageId: process.env.PAGE_ID,
  appId: process.env.APP_ID,
  pageAccesToken: process.env.PAGE_ACCESS_TOKEN,
  appSecret: process.env.APP_SECRET,
  verifyToken: process.env.VERIFY_TOKEN,

  // URL of your app domain
  appUrl: process.env.APP_URL,

  // URL of your website
  shopUrl: process.env.SHOP_URL,

  // Persona IDs
  personas: {},

  // Preferred port (default to 3000)
  port: process.env.PORT || 3000,

  get mPlatfom() {
    return this.mPlatformDomain + "/" + this.mPlatformVersion;
  },

  // URL of your webhook endpoint
  get webhookUrl() {
    return this.appUrl + "/webhook";
  },

  get newPersonas() {
    return [
      {
        name: "Jorge",
        picture: `${this.appUrl}/personas/sales.jpg`
      },
      {
        name: "Laura",
        picture: `${this.appUrl}/personas/billing.jpg`
      },
      {
        name: "Riandy",
        picture: `${this.appUrl}/personas/order.jpg`
      },
      {
        name: "Daniel",
        picture: `${this.appUrl}/personas/care.jpg`
      }
    ];
  },

  pushPersona(persona) {
    this.personas[persona.name] = persona.id;
  },

  get personaSales() {
    let id = this.personas["Jorge"] || process.env.PERSONA_SALES;
    return {
      name: "Jorge",
      id: id
    };
  },

  get personaBilling() {
    let id = this.personas["Laura"] || process.env.PERSONA_BILLING;
    return {
      name: "Laura",
      id: id
    };
  },

  get personaOrder() {
    let id = this.personas["Riandy"] || process.env.PERSONA_ORDER;
    return {
      name: "Riandy",
      id: id
    };
  },

  get personaCare() {
    let id = this.personas["Daniel"] || process.env.PERSONA_CARE;
    return {
      name: "Daniel",
      id: id
    };
  },

  get whitelistedDomains() {
    return [this.appUrl, this.shopUrl];
  },

  checkEnvVariables: function() {
    if (config.error) {
      if (config.error.code == "ENOENT") {
        console.log("WARNING: Your .env file is missing.");
      } else {
        console.dir(config.error);
      }
      process.exit(1);
    }

    const parsedVariables = config.parsed;
    var keys = [
      "PAGE_ID",
      "APP_ID",
      "PAGE_ACCESS_TOKEN",
      "APP_SECRET",
      "VERIFY_TOKEN",
      "APP_URL",
      "SHOP_URL"
    ];
    keys.forEach(function(key) {
      if (!parsedVariables[key]) {
        console.log("WARNING: Your .env file is missing " + key);
      } else {
        // Check that urls use https
        if (["APP_URL", "SHOP_URL"].includes(key)) {
          const url = parsedVariables[key];
          if (!url.startsWith("https://")) {
            console.log(
              "WARNING: Your " + key + ' does not begin with "https://"'
            );
          }
        }
      }
    });
  }
};
