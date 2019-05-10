const conf = require('./config');

const http = require('http');

const app = require('./api/app');

const port = conf.PORT;
const domain = conf.DOMAIN;
const server = http.createServer(app);

server.listen(port, domain, () => {
  console.log(`Server is listening on http://${domain}:${port}`);
});