const { EmbedBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

// Resizing the party
const resizeParty = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  const newSize = parseInt(args[3]);

  if (isNaN(newSize)) {
    message.channel.send('Invalid party size');
    return;
  }

  // Limit the party size to a maximum of 100
  if (newSize > 100) {
    message.channel.send('Party size cannot exceed 100');
    return;
  }

  // Fetch the party from the database
  const party = await db.get(game);

  // Check if a party with the given name already exists
  if (!party) {
    message.channel.send('No party titled ' + game + ' found.');
    return;
  }

  // Check if the user is the host of the party
  if (party.creator !== message.author.tag) {
    message.channel.send('Only the host can resize the party.');
    return;
  }

  // Resize the party
  party.size = newSize;

  // Create the party description
  let partyDescription = '';
  let color = 0xFF0000;
  for (let i = 0; i < party.size; i++) {
    if(i < party.members.length) {
      partyDescription += `${i+1}. ${party.members[i].tag}\n`;
    } else {
      partyDescription += `${i+1}.\n`;
    }
  }

  // Check if the party is complete
  if (party.size === party.members.length) {
    // Change the color to green
    color = 0x32CD32;
    // Delete the party from the database
    await db.delete(game);
    // Mention the members
    const membersMention = party.members.map(member => `<@${member.id}>`).join(', ');
    message.channel.send(`Party is complete! ${membersMention}`);
  } else {
    // Update the party in the database
    await db.set(game, party);
  }

  // Create an embed with the updated party information
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(game)
    .setDescription(partyDescription)
    .setFooter({text: `Party hosted by ${party.creator}`, iconURL: party.creatorAvatarURL});

  message.channel.send({ embeds: [embed] });
}

module.exports = resizeParty;
