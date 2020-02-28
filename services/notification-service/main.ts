import dotenv from "dotenv";
dotenv.config();

// Types
import { Channel, Message } from "amqplib";

// Init logger for service
import logger from "./config/logger_config";

// Init RabbitMQ connection to notifications queue
import { getRabbitMqChannelClient } from "./config/rabbitmq_config";

// Initialize email client
import { sendEmailNotification } from "./config/mailer_config";


const consumeNotificationsBuffer = async (): Promise<void> => {

  // Create connection channel to RabbitMQ
  const channel: Channel = await getRabbitMqChannelClient();

  logger.info("Listening to queue for notifications");

  // Process messages from RabbitMQ
  channel.consume(process.env.NOTIFICATIONS_QUEUE_NAME, async (message: Message) => {
    try {
      // Convert binary buffer to parsed JSON
      const emailNotification = JSON.parse(message.content.toString());

      logger.info(`Sending email to ${emailNotification.email}`);

      // Send email notification
      await sendEmailNotification(emailNotification);

      // Acknowledge that message has been processed
      channel.ack(message);
    }
    catch (error) {
      // Acknowledge that message has been processed
      channel.ack(message);

      logger.error(error);
    }
  }, { noAck: false });
}

// Start consuming messages
consumeNotificationsBuffer();