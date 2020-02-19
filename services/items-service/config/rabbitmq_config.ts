import amqp from "amqplib";

// Config
import logger from "./logger_config";

// Types
import { Connection, Channel } from "amqplib";
import { NotificationTypes } from "../../utils/Enums";


interface INotificationMessage {
  notificationType: NotificationTypes;
  name: string;
  description: string;
  firstName: string;
  email: string;
}

// Keep open channel in module variable
let channel: Channel = null;

const createRabbitMqConnection = async (): Promise<void> => {
  try {
    // Create connection to RabbitMQ server
    const connection: Connection = await amqp.connect(process.env.RABBIT_MQ_URL);

    // Create channel client
    channel = await connection.createChannel();

    // Create notifications channel if it does not exist
    await channel.assertQueue(process.env.NOTIFICATIONS_QUEUE_NAME);

    logger.info(`RabbitMQ connection to ${process.env.NOTIFICATIONS_QUEUE_NAME} channel established`);
  }
  catch (error) {
    logger.error(error);
  }
}

// TODO: Figure out better way to start connection to RabbitMQ
createRabbitMqConnection();


const sendNotificationToQueue = async (message: INotificationMessage): Promise<void> => {
  try {
    // Short circuit if channel has not been set
    if (channel === null) return;

    // Create notifications channel if it does not exist
    await channel.assertQueue(process.env.NOTIFICATIONS_QUEUE_NAME);

    // Send notification message to queue
    channel.sendToQueue(process.env.NOTIFICATIONS_QUEUE_NAME, Buffer.from(JSON.stringify(message)));
  }
  catch (error) {
    logger.error(error);
  }
}

export { sendNotificationToQueue };
