const Database = require('@replit/database');
const db = new Database();
const { EmbedBuilder } = require('discord.js');

// Joining a party

module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  const guildId = message.guild.id; // get the server id

  // Check if a party with the given title exists
  const partyKey = `${guildId}-${game}`; // use server id as prefix to game
  const party = await db.get(partyKey);
  if (!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }
  
  // Check if the user is already in the party
  if (party.membersOrder.some(member => member.tag === message.author.tag)) {
    message.channel.send('You are already in this party.');
    return;
  }

  // Add the user to the party
  const newMember = {tag: message.author.tag, id: message.author.id};
  party.membersOrder.push(newMember);
  if (party.members.length < party.size) {
    party.members.push(newMember);
  }

  // Create the party Description
  let partyDescription = '';
  for (let i = 0; i < party.size; i++) {
    if(i < party.membersOrder.length) {
      partyDescription += `${i+1}. ${party.membersOrder[i].tag}\n`;
    } else {
        partyDescription += `${i+1}.\n`;
    }
  }

  // Update the party in the database
  await db.set(partyKey, party);

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
    .setColor(0x32CD32) // Green
    .setTitle(game)
    .setDescription(partyDescription)
    .setFooter({ text: `Party hosted by ${party.creator}`, iconURL: party.creatorAvatarURL });

    // Send the updated party embed
    message.channel.send({ embeds: [embed] });
    message.channel.send(`The party '${game}' is now full. Members: ${memberTags}`);

    // Deletion of party
    await db.delete(partyKey);
  }
};
