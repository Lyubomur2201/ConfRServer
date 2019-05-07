const conf = require('./config');

const http = require('http');

const app = require('./api/app');

const port = conf.PORT || 4000;
const domain = conf.DOMAIN || '0.0.0.0';
const server = http.createServer(app);

server.listen(port, domain, () => {
  console.log(`Server is listening on http://${domain}:${port}`);
});