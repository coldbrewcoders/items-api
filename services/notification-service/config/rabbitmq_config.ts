import amqp from "amqplib";

// Config
import logger from "./logger_config";

// Types
import { Connection, Channel } from "amqplib";


const getRabbitMqChannelClient = async (): Promise<Channel> => {
  try {
    // Create connection to RabbitMQ server
    const connection: Connection = await amqp.connect(process.env.RABBIT_MQ_URL);

    // Create channel client
    const channel: Channel = await connection.createChannel();

    // Create notifications channel if it does not exist
    await channel.assertQueue(process.env.NOTIFICATIONS_QUEUE_NAME, { durable: true });

    // Don't give more than one message to a consumer node at once
    channel.prefetch(1);

    return channel;
  }
  catch (error) {
    logger.error(error);
  }
}

export { getRabbitMqChannelClient };
