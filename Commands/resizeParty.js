const { EmbedBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

// Resizing the party
module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  let newSize = parseInt(args[3], 10); // get the new size from the command arguments

  // Fetch the party from the database
  const party = await db.get(game);

  // Check if a party with the given title exists
  if (!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }

  // Check if the new size is a valid number
  if (isNaN(newSize) || newSize < 1) {
    message.channel.send(`Invalid party size: ${args[3]}. Please specify a positive number.`);
    return;
  }

  // Resize the party
  party.size = newSize;

  // If the new size is less than the number of current members, remove the extra members
  if (newSize < party.members.length) {
    message.channel.send(`Invalid party size: ${args[3]}. Kick the extra members and try again.`);
    return;
  }

  // Create the party Description
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
    .setColor(0xFF0000) // Red
    .setTitle(game)
    .setDescription(partyDescription)
    .setFooter({ text: `Party created by ${party.creator}`, iconURL: party.creatorAvatarURL });

    // Send the updated party embed
    message.channel.send({ embeds: [embed] });
  }

  // If the party is now full, notify all members and delete the party
  if (party.members.length === party.size) {
    const memberTags = party.members.map(member => `<@${member.id}>`).join(', ');
    
    const embed = new EmbedBuilder()
    .setColor(0x00FF00) // Green
    .setTitle(game)
    .setDescription(partyDescription)
    .setFooter({ text: `Party hosted by ${party.creator}`, iconURL: party.creatorAvatarURL });

    // Send the updated party embed
    message.channel.send({ embeds: [embed] });
    message.channel.send(`The party '${game}' is now full. Members: ${memberTags}`);

    // Deletion of party
    await db.delete(game);
  }
}
