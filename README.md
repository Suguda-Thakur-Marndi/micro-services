# Micro-Services Backend

Node.js microservices backend with separate services for users, captains, rides, and an API gateway.

## Services

- user service: authentication and user profile
- captain service: authentication and captain profile
- ride service: ride creation and ride status management
- gateway service: single entry point that proxies requests to internal services

## Project Structure

- user: runs on USER_PORT (default 3001)
- Captain: runs on CAPTAIN_PORT (default 3002)
- ride: runs on RIDE_PORT or PORT (default 3003)
- gateway: runs on GATEWAY_PORT (default 3000)

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB
- RabbitMQ (optional, used by ride service)

## Environment Variables

Create a .env file at the workspace root and add:

```env
MONGO_URI=mongodb://localhost:27017/microservices
JWT_SECRET=your_jwt_secret

USER_PORT=3001
CAPTAIN_PORT=3002
RIDE_PORT=3003
GATEWAY_PORT=3000

USER_SERVICE_URL=http://localhost:3001
CAPTAIN_SERVICE_URL=http://localhost:3002
RIDE_SERVICE_URL=http://localhost:3003

RABBIT_URL=amqp://localhost
```

Notes:

- ride service supports RABBIT_URL and RABBITMQ_URL.
- if MONGO_URI is missing, services skip DB connection.

## Install Dependencies

From workspace root:

```bash
npm install
npm install --prefix user
npm install --prefix Captain
npm install --prefix ride
npm install --prefix gateway
```

Optional (to avoid npx download each run):

```bash
npm install -D concurrently
```

## Run All Services

Development mode:

```bash
npm run dev
```

Production-like mode:

```bash
npm start
```

## Service Health Checks

- user: http://localhost:3001/
- captain: http://localhost:3002/
- ride: http://localhost:3003/
- gateway: http://localhost:3000/health

## Main API Routes

Through gateway:

- users: /users
- captains: /captains
- rides: /rides

Direct service routes:

### user

- POST /users/register
- POST /users/login
- POST /users/logout
- GET /users/profile

### captain

- POST /captains/register
- POST /captains/login
- POST /captains/logout
- GET /captains/profile
- PATCH /captains/profile

### ride

- GET /rides/health
- POST /rides/create
- GET /rides
- GET /rides/:id
- PATCH /rides/:id/status
- PATCH /rides/:id/cancel

## Quick Troubleshooting

- Port already in use: change USER_PORT, CAPTAIN_PORT, RIDE_PORT, or GATEWAY_PORT.
- Mongo not connected: verify MONGO_URI and database availability.
- Unauthorized errors: verify JWT_SECRET is set and token is passed in cookie or Bearer token.
- RabbitMQ disabled log in ride service: set RABBIT_URL or RABBITMQ_URL.
