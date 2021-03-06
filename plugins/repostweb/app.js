"use strict";

var resfile = 'reposts.json';
var configMixin = require('../../resourceManager.js').mixin;
var path =  require('path');
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

function RepostStore() {}

configMixin(RepostStore);

var r = new RepostStore();
var data;
var urls;
var posts;


function load() {
  r.load('reposts', resfile, function(e, d) {
    if (e) {
      //dont care
      return;
      //throw e;
    }

    if (d !== undefined && d._urls !== undefined && d._nicks !== undefined) {
      data = d;
      urls = Object.keys(data._urls);
      posts = {};

      for(var i = 0, l = urls.length; i < l; i++) {
        var url = data._urls[urls[i]];
        var nick = url.firstPoster.nick;

        if(nick === undefined) {
          continue;
        }

        if(posts[nick] === undefined) {
          posts[nick] = [];
        }

        posts[nick].push(urls[i]);
      }
    }
  });
}

load();

setInterval(function () {
  load();
}, 100000);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {

  var urlz = Array.prototype.slice.call(urls);

  res.render('index', { title: 'Reposts', urls: urlz.reverse(), data: data});
});

app.get('/nicks', function(req,res) {
  var nickdata = data._nicks;
  var nicks = Object.keys(data._nicks);

  res.render('nicks', { title: 'Nicks', data : nickdata, nicks : nicks, urls : urls, posts:posts});
});

app.get('/repost/:id', function(req,res) {

  var id = req.params.id;

  if(!id) {
    return;
  }

  var key = urls[id];

  if(!key) {
    return;
  }

  var repost = data._urls[key];

  if(!repost) {
    return;
  }

  res.render('repost', { repost: repost, url : key, id : id});
});

var server = app.listen(14140, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Repostweb listening at http://%s:%s', host, port);
});