'use strict';

// Imports dependencies
const Response = require('./response'),
  config = require('./config'),
  i18n = require('../i18n.config');

module.exports = class Curation {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;
    // let outfit;

    switch (payload) {
      case 'OPEN_DOOR':
        response = [
          Response.genMediaTemplate(
            `https://www.facebook.com/107683150653553/videos/559838591439616/?modal=admin_todo_tour`
          ),
          Response.genQuickReply(i18n.__('step1.prompt'), [
            {
              title: i18n.__('step1.go_downstairs'),
              payload: 'GO_DOWNSTAIRS',
            },
            {
              title: i18n.__('step1.go_upstairs'),
              payload: 'GO_UPSTAIRS',
            },
          ]),
        ];
        break;
    }

    return response;
  }

  randomOutfit() {
    let occasion = ['work', 'party', 'dinner'];
    let randomIndex = Math.floor(Math.random() * occasion.length);

    return occasion[randomIndex];
  }
};
