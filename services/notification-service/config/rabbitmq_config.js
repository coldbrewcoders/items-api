const amqp = require("amqplib");


const NOTIFICATIONS_QUEUE_NAME = "notifications";

const createRabbitMqConnection = () => {
  try {
    // Create connection to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBIT_MQ_URL);

    // Create channel client
    const channel = await connection.createChannel();

    // Create notifications channel if it does not exist
    await channel.assetQueue(NOTIFICATIONS_QUEUE_NAME);

    return channel;
  }
  catch (error) {
    console.error(error);
  }
}

const channel = createRabbitMqConnection();


module.exports = {
  channel,
  NOTIFICATIONS_QUEUE_NAME
};

