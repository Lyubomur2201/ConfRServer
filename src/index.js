const dotenv = require('dotenv').config();

const http = require('http');

const app = require('./api/app');

const port = process.env.PORT;
const domain = process.env.DOMAIN;
const server = http.createServer(app);

server.listen(port, domain, () => {
  console.log(`Server is listening on http://${domain}:${port}`);
});