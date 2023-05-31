const Database = require('@replit/database');
const db = new Database();
const { EmbedBuilder } = require('discord.js');

// Kicking a member of the party

module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  const guildId = message.guild.id; // get the server id
  let playerKick = args[3];

  // Check if a party with the given title exists
  const partyKey = `${guildId}-${game}`; // use server id as prefix to game
  const party = await db.get(partyKey);
  if(!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }

  // Check if the user is the host of the party
  if (message.author.tag !== party.creator) {
    message.channel.send(`Only the host can kick members from the party.`);
    return;
  }

  // Check if the user is in the party
  let memberIndex;
  if (isNaN(playerKick)) {
    memberIndex = party.members.findIndex(member => member.tag === playerKick);
  } else {
    playerKick = parseInt(playerKick, 10) - 1;
    memberIndex = playerKick >= 0 && playerKick < party.membersOrder.length ? playerKick : -1;
  }
  
  if (memberIndex === -1) {
    message.channel.send(`${args[3]} is not in this party.`);
    return;
  }

  // Remove the user from the party
  const kickedMember = party.membersOrder[memberIndex];
  party.membersOrder.splice(memberIndex, 1);
  party.members = party.members.filter(member => member.tag !== kickedMember.tag);

  // Update the party in the database
  await db.set(partyKey, party);

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
}
