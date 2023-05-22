const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("Hello world!");
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

//Test for functionality of bot
client.on("messageCreate", message => {
  if (message.content === "ping") {
    message.channel.send("pong")
  }

  //Test to see format for Party Queue
  if (message.content === "!lgn test") {
    const embed = new EmbedBuilder()  
    .setTitle("Party #1")
    .setDescription("1. NegevBro#0369")
    .setFooter({text: "Party created by NegevBro#0369"});

    message.channel.send({ embeds: [embed] });
  }

  //Command to create a party queue
  if (message.content === "!lgn create") {
    //this is a test of merging this branch to main
  }
  
})

client.login(process.env.token);