const express = require("express");
const app = express();
const Database = require('@replit/database');
const db = new Database();

app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("Successful bot start!");
})

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js')


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
})

// RESET OF PARTIES EVERY 7 DAYS TO CLEAR SPACE

function scheduleCleanup() {
  const now = new Date();
  let nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  let delay = nextMidnight - now; // time until next midnight

  // If it's already past midnight, calculate time until midnight after 7 days
  if (delay < 0) {
    nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);
    delay = nextMidnight - now;
  }

  setTimeout(() => {
    // Delete all parties at midnight
    deleteAllParties();

    // Then continue to delete all parties every 7 days
    setInterval(deleteAllParties, 1000 * 60 * 60 * 24 * 7); // 7 days in milliseconds
  }, delay);
}

async function deleteAllParties() {
  // Fetch all keys (party names) from the database
  const keys = await db.list();

  // Delete each party
  for (const key of keys) {
    await db.delete(key);
  }

  // Notify channels about the deletion
  notifyChannels();
}

async function notifyChannels() {
  // Fetch all channels from the database
  const channelIDs = await db.get('channelIDs');

  // For each channel ID, send a message
  for (const id of channelIDs) {
    const channel = await client.channels.fetch(id);
    channel.send('All parties are cleared.');
  }
}

const parties = new Map();
const createParty = require('./Commands/createParty.js');
const cancelParty = require('./Commands/cancelParty.js');
const joinParty = require('./Commands/joinParty.js');
const kickParty = require('./Commands/kickParty.js');
const transferHostParty = require('./Commands/transferHostParty.js');
const resizeParty = require('./Commands/resizeParty.js');
const mentionParty = require('./Commands/mentionParty.js');
const listParty = require('./Commands/listParty.js');
const help = require('./Commands/help.js');

client.on("messageCreate", message => {
  const args = message.content.split(' ');

  // Help command
  if (args[0] === "!l" && args[1] === "help") {
    help(message);
  }

  // Creating a party
  if (args[0] === "!l" && args[1] === "create") {
  createParty(message, db);
  }  

  // Cancel a party
  if (args[0] === "!l" && args[1] === "cancel") {
    cancelParty(message, db);
  }

  // Join a party
  if (args[0] === "!l" && args[1] === "join") {
    joinParty(message, db);
  }

  // Kick a member in the party
  if (args[0] === "!l" && args[1] === "kick") {
    kickParty(message, db);
  }

  // Transfer Host in the party
  if (args[0] === "!l" && args[1] === "transfer") {
    transferHostParty(message, db, client);
  }

  // Resize slots in the party
  if (args[0] === "!l" && args[1] === "resize") {
    resizeParty(message, db);
  }

  // Mention members in the party
  if (args[0] === "!l" && args[1] === "mention") {
    mentionParty(message, db, client);
  }

  // List all parties in the server
  if (args[0] === "!l" && args[1] === "list") {
    listParty(message, db);
  }
  
})

scheduleCleanup();

client.login(process.env.token);