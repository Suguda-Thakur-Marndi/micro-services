const amqp = require('amqplib');

let connection;
let channel;

async function connectRabbitMQ() {
	const rabbitUrl = process.env.RABBIT_URL || process.env.Rbbit_url;

	if (!rabbitUrl) {
		console.log('RABBIT_URL is not set. RabbitMQ is disabled.');
		return null;
	}

	if (channel) {
		return channel;
	}

	try {
		connection = await amqp.connect(rabbitUrl);
		channel = await connection.createChannel();
		console.log('Ride service connected to RabbitMQ');
		return channel;
	} catch (error) {
		console.error('RabbitMQ connection error:', error.message);
		return null;
	}
}

async function publishMessage(queueName, payload) {
	const currentChannel = await connectRabbitMQ();
	if (!currentChannel) {
		return false;
	}

	await currentChannel.assertQueue(queueName, { durable: true });
	return currentChannel.sendToQueue(
		queueName,
		Buffer.from(JSON.stringify(payload)),
		{ persistent: true }
	);
}

async function subscribeMessage(queueName, handler) {
	const currentChannel = await connectRabbitMQ();
	if (!currentChannel) {
		return null;
	}

	await currentChannel.assertQueue(queueName, { durable: true });
	return currentChannel.consume(queueName, async (message) => {
		if (!message) {
			return;
		}

		try {
			const parsed = JSON.parse(message.content.toString());
			await handler(parsed);
			currentChannel.ack(message);
		} catch (error) {
			console.error('Message processing failed:', error.message);
			currentChannel.nack(message, false, false);
		}
	});
}

async function closeRabbitMQ() {
	try {
		if (channel) {
			await channel.close();
			channel = null;
		}
		if (connection) {
			await connection.close();
			connection = null;
		}
	} catch (error) {
		console.error('Error while closing RabbitMQ connection:', error.message);
	}
}

module.exports = {
	connectRabbitMQ,
	publishMessage,
	subscribeMessage,
	closeRabbitMQ,
};
