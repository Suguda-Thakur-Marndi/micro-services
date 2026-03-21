const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const PORT = process.env.CAPTAIN_PORT || 3002;

server.listen(PORT, () => {
  console.log(`Captain service is running on port ${PORT}`);
});