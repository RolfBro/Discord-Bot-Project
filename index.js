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

// Test for functionality of bot
client.on("messageCreate", message => {
  if (message.content === "ping") {
    message.channel.send("pong")
  }

  // Test to see format for Party Queue
  if (message.content === "!lgn test") {
    const embed = new EmbedBuilder()  
    .setTitle("Party #1")
    .setDescription("1. NegevBro#0369")
    .setFooter({text: "Party created by NegevBro#0369"});

    message.channel.send({ embeds: [embed] });
  }

  // Command to create a party queue
  const args = message.content.split(' ');
  if (args[0] === "!lgn" && args[1] === "create") {
    const game = args[2];
    const partySize = parseInt(args[3]);

    if (isNaN(partySize)) {
      message.channel.send('Invalid party size');
      return;
    }

    // Check if a party with the given name already exists
    if (parties.has(game)) {
      message.channel.send('A party with this name already exists');
      return;
    }
    
    // Create the party
    const party = {
      creator: message.author.tag,
      creatorAvatarURL: message.author.displayAvatarURL(),
      members: [{tag: message.author.tag, id: message.author.id}],
      size: partySize
    };

    // Store the party using the game as key
    parties.set(game, party);

    // Create the party description
    let partyDescription = '';
    for (let i = 0; i < party.size; i++) {
      if(i < party.members.length) {
        partyDescription += `${i+1}. ${party.members[i].tag}\n`;
      } else {
          partyDescription += `${i+1}.\n`;
      }
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(game)
      .setDescription(partyDescription)
      .setFooter({text: `Party created by ${message.author.tag}`, iconURL:                        message.author.displayAvatarURL()});

    message.channel.send({ embeds: [embed] });
  }

  // Cancel a party
  if (args[0] === "!lgn" && args[1] === "cancel") {
    const game = args[2];

    // Check if a party with the given title exists
    if (!parties.has(game)) {
      message.channel.send(`No party titled '${game}' found`);
      return;
    }

    const party = parties.get(game);

    // Check if the message author is the creator of the party
    if (message.author.tag !== party.creator) {
      message.channel.send('You are not the creator of this party.');
      return;
    }

    // Delete the party
    parties.delete(game);
    message.channel.send(`Party titled '${game}' has been cancelled`);
  }

  // Join a party
  if (args[0] === "!lgn" && args[1] === "join") {
    const game = args[2];

    // Check if a party with the given title exists
    if (!parties.has(game)) {
      message.channel.send(`No party titled '${game}' found.`);
      return;
    }
    
    const party = parties.get(game);
    
    // Check if the user is already in the party
    if (party.members.includes(message.author.tag)) {
      message.channel.send('You are already in this party.');
      return;
    }

    // Add the user to the party
    party.members.push({tag: message.author.tag, id: message.author.id});

    //Create the party Description
    let partyDescription = '';
    for (let i = 0; i < party.size; i++) {
      if(i < party.members.length) {
        partyDescription += `${i+1}. ${party.members[i].tag}\n`;
      } else {
          partyDescription += `${i+1}.\n`;
      }
    }

    // If the party is not yet full, don't notify members yet
    if (party.members.length < party.size) {
      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(game)
      .setDescription(partyDescription)
      .setFooter({text: `Party created by ${party.creator}`,                           iconURL: party.creatorAvatarURL});

      // Send the updated party embed
      message.channel.send({ embeds: [embed] });
    }

    // If the party is now full, notify all members and delete the party
    if (party.members.length === party.size) {
      const memberTags = party.members.map(member => `<@${member.id}>`).join(', ');
      
      const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(game)
      .setDescription(partyDescription)
      .setFooter({text: `Party created by ${party.creator}`,                           iconURL: party.creatorAvatarURL});

      // Send the updated party embed
      message.channel.send({ embeds: [embed] });
      message.channel.send(`The party '${game}' is now full. Members: ${memberTags}`);

      // Deletion of party
      parties.delete(game);
    }
  }
})

client.login(process.env.token);