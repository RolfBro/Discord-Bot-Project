const express = require("express");
const app = express();

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

client.on("messageCreate", message => {
  const args = message.content.split(' ');

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
  
})

client.login(process.env.token);