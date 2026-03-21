const http = require('http');
const app = require('./app');
const { connectRabbitMQ, closeRabbitMQ } = require('./rabbit');

const PORT = process.env.PORT || 3003;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Ride service is running on port ${PORT}`);
  connectRabbitMQ();
});

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
