"use strict";
let di = require('di');
let Fulbot = require('./lib/fulbot');

let injector = new di.Injector([]);

let bot = injector.get(Fulbot);

bot.connect();


bot.client.on("message", () => { console.log(arguments)});