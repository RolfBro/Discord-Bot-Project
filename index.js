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
const leaveParty = require('./Commands/leaveParty.js');
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

  // Leave a party if you aren't the host
  if (args[0] === "!l" && args[1] === "leave") {
    leaveParty(message, db);
  }
  
});

client.once('ready', () => {
  console.log('Bot is running!');

  // Define and register the /help command
  client.application.commands.create({
    name: 'help',
    description: 'Shows a list of available commands',
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('Available Commands')
      .addFields(
        { name: '!l create [party name] [party size]', value: 'Create a new party' },
        { name: '!l cancel [party name]', value: 'Cancel an existing party' },
        { name: '!l join [party name]', value: 'Join an existing party' },
        { name: '!l kick [party name] [member]', value: 'Kick a member from the party' },
        { name: '!l transfer [party name] [new host]', value: 'Transfer the host role to another member' },
        { name: '!l resize [party name] [new size]', value: 'Resize the party' },
        { name: '!l mention [party name]', value: 'Mention all members of the party' },
        { name: '!l list', value: 'List all active parties' },
      )
      .setFooter({text: 'Use these commands to interact with the bot.'});
  
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

scheduleCleanup();

client.login(process.env.token);