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

// Imports dependencies
const 
  Features = require("../services/features"),
  Menu = require("../services/menu"),
  Order = require("../services/order"),
  Products = require("../services/products"),
  Promo = require("../services/promo"),
  Support = require("../services/support"),
  Survey = require("../services/survey");

module.exports = {
  Features: Features,
  Menu: Menu,
  Order: Order,
  Products: Products,
  Promo: Promo,
  Support: Support,
  Survey: Survey
};
