var json = require('jsonfile');
var config = json.readFileSync(__dirname + '/config.json');
var ChatServer = require('./modules/server');

// Instantiate Chat Server
new ChatServer(config);

// Instantiate Express in Production Mode
if (process.env.WEBSERVER) {
  var express = require('express');
  var path = require('path');
  var router = express.Router();
  var app = express();
  var staticPath = `${__dirname}/../../dist`;
  var port = config.webServer.port;

  router.get(['/', '/chat', '/login'], function (req, res) {
    res.sendFile(path.resolve(`${staticPath}/index.html`));
  });

  app.use('/', router);
  app.use(express.static(path.resolve(staticPath)));
  app.listen(port);
  console.log(`Web server listening on port: ${port}`);
}
