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

// Imports dependencies
const GraphAPi = require("./core/graph-api"),
  i18n = require("../i18n/i18n.config"),
  config = require("../config/config"),
  locales = i18n.getLocales();

module.exports = class Profile {
  setWebhook() {
    GraphAPi.callSubscriptionsAPI();
    GraphAPi.callSubscribedApps();
  }

  setPageFeedWebhook() {
    GraphAPi.callSubscriptionsAPI("feed");
    GraphAPi.callSubscribedApps("feed");
  }

  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(),
      ...this.getPersistentMenu()
    };

    GraphAPi.callMessengerProfileAPI(profilePayload);
  }

  setPersonas() {
    let newPersonas = Config.newPersonas;

    GraphAPi.getPersonaAPI()
      .then(personas => {
        for (let persona of personas) {
          Config.pushPersona({
            name: persona.name,
            id: persona.id
          });
        }
        console.log(Config.personas);
        return Config.personas;
      })
      .then(existingPersonas => {
        for (let persona of newPersonas) {
          if (!(persona.name in existingPersonas)) {
            GraphAPi.postPersonaAPI(persona.name, persona.picture)
              .then(personaId => {
                Config.pushPersona({
                  name: persona.name,
                  id: personaId
                });
                console.log(Config.personas);
              })
              .catch(error => {
                console.log("Creation failed:", error);
              });
          } else {
            console.log("Persona already exists for name:", persona.name);
          }
        }
      })
      .catch(error => {
        console.log("Creation failed:", error);
      });
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    GraphAPi.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    GraphAPi.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    GraphAPi.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    GraphAPi.callMessengerProfileAPI(domainPayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: "GET_STARTED"
      }
    };
  }

  getGreeting() {
    let greetings = [];

    for (let locale of locales) {
      greetings.push(this.getGreetingText(locale));
    }

    return {
      greeting: greetings
    };
  }

  getPersistentMenu() {
    let menuItems = [];

    for (let locale of locales) {
      menuItems.push(this.getMenuItems(locale));
    }

    return {
      persistent_menu: menuItems
    };
  }

  getGreetingText(locale) {
    let param = locale === "en_US" ? "default" : locale;

    i18n.setLocale(locale);

    let localizedGreeting = {
      locale: param,
      text: i18n.__("profile.greeting", {
        user_first_name: "{{user_first_name}}"
      })
    };

    console.log(localizedGreeting);
    return localizedGreeting;
  }

  getMenuItems(locale) {
    let param = locale === "en_US" ? "default" : locale;

    i18n.setLocale(locale);

    let localizedMenu = {
      locale: param,
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: i18n.__("menu.support"),
          type: "nested",
          call_to_actions: [
            {
              title: i18n.__("menu.order"),
              type: "postback",
              payload: "TRACK_ORDER"
            },
            {
              title: i18n.__("menu.help"),
              type: "postback",
              payload: "CARE_HELP"
            }
          ]
        },
        {
          title: i18n.__("menu.suggestion"),
          type: "postback",
          payload: "CURATION"
        },
        {
          type: "web_url",
          title: i18n.__("menu.shop"),
          url: Config.shopUrl,
          webview_height_ratio: "full"
        }
      ]
    };

    console.log(localizedMenu);
    return localizedMenu;
  }

  getWhitelistedDomains() {
    let whitelistedDomains = {
      whitelisted_domains: Config.whitelistedDomains
    };

    console.log(whitelistedDomains);
    return whitelistedDomains;
  }
};
