import dotenv from "dotenv";
dotenv.config();

// Types
import { Channel, Message } from "amqplib";

// Init logger for service
import logger from "./config/logger_config";

// Init RabbitMQ connection to notifications queue
import { createRabbitMqConnection } from "./config/rabbitmq_config";

// Initialize email client
import "./config/mailer_config";


const consumeNotificationsBuffer = async (): Promise<void> => {

  // Create connection channel to RabbitMQ
  const channel: Channel = await createRabbitMqConnection();

  logger.info("Listening to queue for notifications")

  // Process messages from RabbitMQ
  channel.consume(process.env.NOTIFICATIONS_QUEUE_NAME, (message: Message) => {
    try {
      console.log("TCL: message", JSON.parse(message.content.toString()));
      channel.ack(message);
    }
    catch (error) {
      logger.error(error);
      channel.ack(message);
    }
  });
}

// Start consuming messages
consumeNotificationsBuffer();