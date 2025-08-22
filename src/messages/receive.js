import { connect } from 'amqplib';

async function receiveMessages() {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'messages';

  await channel.assertQueue(queue, { durable: false });
  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log(`[x] Received ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

receiveMessages();
