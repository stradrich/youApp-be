// // src/messages/chatUser.js
// import readline from 'readline';
// import amqp from 'amqp-connection-manager';

// const [,, currentUser, peerUser] = process.argv;

// if (!currentUser || !peerUser) {
//   console.error('Usage: node chatUser.js <yourUserId> <peerUserId>');
//   process.exit(1);
// }

// const connection = amqp.connect(['amqp://localhost']);
// const channel = connection.createChannel({
//   json: true, // enable automatic JSON serialization
//   setup: async (ch) => {   // <- remove ": ConfirmChannel"
//     await ch.assertQueue(`user_${currentUser}`, { durable: true });
//     await ch.assertQueue(`user_${peerUser}`, { durable: true });

//     await ch.consume(`user_${currentUser}`, (msg) => {
//     if (msg) {
//         const payload = JSON.parse(msg.content.toString());
//         console.log(`\n📨 Message from ${payload.fromUserId}: ${payload.text}`);
//         rl.prompt(true);
//     }
//     }, { noAck: true });
//   },
// });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: '💬> ',
// });

// rl.prompt();

// rl.on('line', async (line) => {
//   const message = {
//     fromUserId: currentUser,
//     toUserId: peerUser,
//     text: line.trim(),
//     createdAt: new Date(),
//   };

//   try {
//     await channel.sendToQueue(`user_${peerUser}`, message, { persistent: true });
//     console.log('✅ Message sent!');
//   } catch (err) {
//     console.error('❌ Failed to send message:', err);
//   }

//   rl.prompt();
// }).on('close', () => {
//   console.log('👋 Exiting chat...');
//   process.exit(0);
// });

import mongoose from "mongoose";
import amqp from "amqplib";
import readline from "readline";

// --- MongoDB Setup ---
// const MONGO_URI = "mongodb://127.0.0.1:27017/youapp"; // adjust if needed
// const MONGO_URI = "mongodb://youappuser:yourpassword@127.0.0.1:27017/youapp?authSource=youapp";
const MONGO_URI = "mongodb://test:test123@127.0.0.1:27017/youapp?authSource=admin";


const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// --- RabbitMQ + CLI Chat ---
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node chatUser.js <yourUserId> <peerUserId>");
  process.exit(1);
}
const [userId, peerId] = args;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();
  const queue = `chat_${userId}`;
  await channel.assertQueue(queue, { durable: false });

  console.log(`💬 Chat started between ${userId} and ${peerId}`);

  // --- Consume Messages ---
  channel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log(`📨 Message from ${data.senderId}: ${data.content}`);

        // Save incoming message
        const newMsg = new Message({
          senderId: data.senderId,
          receiverId: userId,
          content: data.content,
        });
        await newMsg.save();
      }
    },
    { noAck: true }
  );

  // --- CLI Input ---
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "💬> ",
  });
  rl.prompt();

  rl.on("line", async (line) => {
    const content = line.trim();
    if (!content) {
      rl.prompt();
      return;
    }

    const msgData = { senderId: userId, receiverId: peerId, content };

    // Save outgoing message
    const newMsg = new Message(msgData);
    await newMsg.save();

    // Send via RabbitMQ
    await channel.sendToQueue(`chat_${peerId}`, Buffer.from(JSON.stringify(msgData)));
    console.log("✅ Message sent!");
    rl.prompt();
  });
}

run().catch((err) => console.error("❌ Error:", err));

