const { EmbedBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

// Creation of party
const createParty = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  const partySize = parseInt(args[3]);

  if (isNaN(partySize)) {
    message.channel.send('Invalid party size');
    return;
  }

  // Limit the party size to a maximum of 100
  if (partySize > 100) {
    message.channel.send('Party size cannot exceed 100');
    return;
  }

  // Check if a party with the given name already exists
  const existingParty = await db.get(game);
  if (existingParty) {
    message.channel.send('A party with this name already exists');
    return;
  }

  // Check if the user has already created a party
  const keys = await db.list();
  const userParties = [];
  for (const key of keys) {
    const party = await db.get(key);
    if (party.creator === message.author.tag) {
      userParties.push(party);
    }
  }
  if (userParties.length > 0) {
    message.channel.send('You can only create one party');
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
  await db.set(game, party);

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
    .setFooter({text: `Party hosted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL()});

  message.channel.send({ embeds: [embed] });
}

module.exports = createParty;