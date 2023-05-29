const Database = require('@replit/database');
const db = new Database();
const { EmbedBuilder } = require('discord.js');

// Kicking a member of the party

module.exports = async (message) => {
  
  const args = message.content.split(' ');
  const game = args[2];
  let playerKick = (args[3]);

  // Check if a party with the given title exists
  const party = await db.get(game);
  if(!party) {
    message.channel.send(`No party titled '${game} found.'`);
    return;
  }

  // Check if the user is in the party
  let memberIndex;
  if (isNaN(playerKick)) {
    memberIndex = party.members.findIndex(member => member.tag === playerKick);
  } else {
    playerKick = parseInt(playerKick, 10) - 1;
    memberIndex = playerKick >= 0 && playerKick < party.members.length ? playerKick : -1;
  }
  
  if (memberIndex === -1) {
    message.channel.send(`${playerKick} is not in this party.`);
    return;
  }

  // Remove the user from the party
  party.members.splice(memberIndex, 1);

  // Update the party in the database
  await db.set(game, party);

  // Create the party Description
  let partyDescription = '';
  for (let i = 0; i < party.size; i++) {
    if(i < party.members.length) {
      partyDescription += `${i+1}. ${party.members[i].tag}\n`;
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
}
