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

module.exports = class User {
  constructor(psid) {
    this.psid = psid;
    this.firstName = "";
    this.lastName = "";
    this.locale = "en_US";
    this.timezone = "";
    this.gender = "neutral";
  }
  setProfile(profile) {
    this.firstName = profile.firstName || "";
    this.lastName = profile.lastName || "";
    this.locale = profile.locale || "";
    this.timezone = profile.timezone || "";
    this.gender = profile.gender || "";
  }
};
