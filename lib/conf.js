"use strict";
let di = require('di');
let conf = require('../config.json');

class Configuration {
  constructor() {
    this.client = conf.client;
  }
}

di.annotate(Configuration, new di.Provide(Configuration));

module.exports = Configuration;