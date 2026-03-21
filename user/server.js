const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const PORT = process.env.USER_PORT || 3001;

server.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});