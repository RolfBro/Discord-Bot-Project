// leaveParty.js
const { EmbedBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];

  const guildId = message.guild.id; // get the server id
  const gameKey = `${guildId}-${game}`; // prefix the game name with the server id

  // Fetch the party from the database
  const party = await db.get(gameKey);

  // Check if a party with the given title exists
  if (!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }

  // Check if the user is the host of the party
  if (party.creator === message.author.tag) {
    message.channel.send(`The host cannot leave the party. Transfer ownership or delete the party.`);
    return;
  }

  // Check if the user is in the party
  const memberIndex = party.members.findIndex(member => member.tag === message.author.tag);
  const memberOrderIndex = party.membersOrder.findIndex(member => member.tag === message.author.tag);

  if (memberIndex === -1 || memberOrderIndex === -1) {
    message.channel.send(`You are not in this party.`);
    return;
  }

  // Remove the user from the party
  party.members.splice(memberIndex, 1);
  party.membersOrder.splice(memberOrderIndex, 1);

  // Create the party Description
  let partyDescription = '';
  for (let i = 0; i < party.size; i++) {
    if(i < party.membersOrder.length) {
      partyDescription += `${i+1}. ${party.membersOrder[i].tag}\n`;
    } else {
      partyDescription += `${i+1}.\n`;
    }
  }

  // Create an embed with the updated party information
  const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(game)
    .setDescription(partyDescription)
    .setFooter({text: `Party hosted by ${party.creator}`, iconURL: party.creatorAvatarURL});

  message.channel.send({ embeds: [embed] });

  // Update the party in the database
  await db.set(gameKey, party);
}
