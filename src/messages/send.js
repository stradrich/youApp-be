import { connect } from 'amqplib';

async function sendMessage(msg) {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'messages';

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(msg));

  console.log(`[x] Sent ${msg}`);
  await channel.close();
  await connection.close();
}

sendMessage('Hi Mom!');
