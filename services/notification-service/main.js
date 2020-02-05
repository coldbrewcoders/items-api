require("dotenv").config();

// Init RabbitMQ connection to notifications queue
const { channel, NOTIFICATIONS_QUEUE_NAME } = require("./config/rabbitmq_config");

// Get email client
const { sendEmailNotification } = require("./repository/mailer");


// Process messages from queue
channel.consume(NOTIFICATIONS_QUEUE_NAME, message => {
  try {
    // TODO: Create producer and consumer on queue
    // Parse message content
    const {} = JSON.parse(message.content.toString());

  }
  catch (error) {
    console.error(error);
  }
});