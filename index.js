const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("Successful bot start!");
})

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js')

function clearParties() {
  parties.clear();
  console.log('All parties have been cleared.');
  
  // Schedule the next clearing
  scheduleClearing();
}

function scheduleClearing() {
  // Get the current time
  const now = new Date();
  
  // Calculate how many milliseconds are left until the next 12 AM
  const untilMidnight = (24 - now.getHours()) * 60 * 60 * 1000;
  
  // Schedule the clearing
  setTimeout(clearParties, untilMidnight);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
})

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
  createParty(message, parties);
  }  

  // Cancel a party
  if (args[0] === "!l" && args[1] === "cancel") {
    cancelParty(message, parties);
  }

  // Join a party
  if (args[0] === "!l" && args[1] === "join") {
    joinParty(message, parties);
  }

  // Kick a member in the party
  if (args[0] === "!l" && args[1] === "kick") {
    kickParty(message, parties);
  }

  // Transfer Host in the party
  if (args[0] === "!l" && args[1] === "transfer") {
    transferHostParty(message, parties, client);
  }

  // Resize slots in the party
  if (args[0] === "!l" && args[1] === "resize") {
    resizeParty(message, parties);
  }

  // Mention members in the party
  if (args[0] === "!l" && args[1] === "mention") {
    mentionParty(message, parties);
  }

  // List all parties in the server
  if (args[0] === "!l" && args[1] === "list") {
    listParty(message, parties);
  }
  
})

// Clear parties every day at 12 AM
scheduleClearing();

client.login(process.env.token);