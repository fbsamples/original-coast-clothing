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

"use strict";

// Imports dependencies and set up http server
const express = require("express"),
  { urlencoded, json } = require("body-parser"),
  crypto = require("crypto"),
  path = require("path"),
  In = require("./io/in"),
  Core = require("./api/core/graph-api"),
  Client = require("./api/client"),
  Profile = require("./api/profile"),
  Config = require("./config/config"),
  i18n = require("./i18n/i18n.config"),
  jsonlint = require("jsonlint").parser,
  fs = require("fs"),
  assert = require("assert"),
  app = express();

// i18n JSON needs to be perfect
fs.readdir(path.join(__dirname, "i18n", "locales"), null, function(err, files) {
  if (files && files.length) {
    files.forEach(function(f) {
      if (f.indexOf(".json") > -1) {
        var _json = fs.readFileSync(path.join(__dirname, "i18n", "locales", f)).toString()
        try {
          jsonlint.parse(_json)
        } catch(e) {
          console.log("\nformatting issue detected in i18n JSON file", f)
          console.error(e)
          process.exit(1)
        }
      }
    })
  }
})

var users = {};

// Parse application/x-www-form-urlencoded
app.use(
  urlencoded({
    extended: true
  })
);

// Parse application/json. Verify that callback came from Facebook
app.use(json({ verify: verifyRequestSignature }));

// Health checker
app.get("/health", function(_req, res) {
  res.json({status: 200, code: 200, message: 'Ok!'})
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === Config.verifyToken) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for your webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  // Checks if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      if ("changes" in entry) {
        // Handle Page Changes event
        let receiveMessage = new Receive();
        if (entry.changes[0].field === "feed") {
          let change = entry.changes[0].value;
          switch (change.item) {
            case "post":
              return receiveMessage.sendWelcomeReply(
                "post_id",
                change.post_id
              );
              break;
            case "comment":
              return receiveMessage.sendWelcomeReply(
                "commentgity _id",
                change.comment_id
              );
              break;
            default:
              console.log('Unsupported feed change type.');
              return;
          }
        }
      }

      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];
      // console.log(webhookEvent);

      // Discard uninteresting events
      if ("read" in webhookEvent) {
        // console.log("Got a read event");
        return;
      }

      if ("delivery" in webhookEvent) {
        // console.log("Got a delivery event");
        return;
      }

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;

      if (!(senderPsid in users)) {
        let client = new Client(senderPsid);

        Core.getUserProfile(senderPsid)
          .then(userProfile => {
            client.setProfile(userProfile);
          })
          .catch(error => {
            // The profile is unavailable
            console.log("Profile is unavailable:", error);
          })
          .finally(() => {
            i18n.setLocale(client.locale);
            console.log(
              "New Profile PSID:",
              senderPsid,
              "with locale:",
              i18n.getLocale()
            );
            let messageFromMessenger = new In(client, webhookEvent);
            return messageFromMessenger.triageMessage();
          });
      } else {
        i18n.setLocale(client.locale);
        console.log(
          "Profile already exists PSID:",
          senderPsid,
          "with locale:",
          i18n.getLocale()
        );
        let messageFromMessenger = new In(client, webhookEvent);
        return messageFromMessenger.triageMessage();
      }
    });
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Set up your App's Messenger Profile
app.get("/profile", (req, res) => {
  let token = req.query["verify_token"];
  let mode = req.query["mode"];

  if (!Config.webhookUrl.startsWith("https://")) {
    res.status(200).send("ERROR - Need a proper API_URL in the .env file");
  }
  let profile = new Profile();

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    if (token === Config.verifyToken) {
      if (mode == "webhook" || mode == "all") {
        profile.setWebhook();
        res.write(
          `<p>Set app ${Config.appId} call to ${Config.webhookUrl}</p>`
        );
      }
      if (mode == "profile" || mode == "all") {
        profile.setThread();
        res.write(`<p>Set Messenger Profile of Page ${Config.pageId}</p>`);
      }
      if (mode == "nlp" || mode == "all") {
        Core.callNLPConfigsAPI();
        res.write(`<p>Enable Built-in NLP for Page ${Config.pageId}</p>`);
      }
      if (mode == "domains" || mode == "all") {
        profile.setWhitelistedDomains();
        res.write(`<p>Whitelisting domains: ${Config.whitelistedDomains}</p>`);
      }
      if (mode == "private-reply") {
        profile.setPageFeedWebhook();
        res.write(`<p>Set Page Feed Webhook for Private Replies.</p>`);
      }
      res.status(200).end();
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  } else {
    // Returns a '404 Not Found' if mode or token are missing
    res.sendStatus(404);
  }
});

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  if (!signature) {
    console.log("Couldn't validate the signature.");
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", Config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Check if all environment variables are set
Config.checkEnvVariables();

// listen for requests :)
var listener = app.listen(Config.port, function() {
  console.log("Your app is listening on port " + listener.address().port);

  if (
    Object.keys(Config.personas).length == 0 &&
    Config.appUrl &&
    Config.verifyToken
  ) {
    console.log(
      "Is this the first time running?\n" +
      "Make sure to set the both the Messenger profile, persona " +
      "and webhook by visiting:\n" +
      Config.appUrl +
      "/profile?mode=all&verify_token=" +
      Config.verifyToken
    );
  }

  if (Config.pageId) {
    console.log("Test your app by messaging:");
    console.log("https://m.me/" + Config.pageId);
  }
});
