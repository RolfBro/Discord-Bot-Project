const { EmbedBuilder } = require('discord.js');
const Database = require('@replit/database');
const db = new Database();

// Transferring ownership of the party
module.exports = async (message, parties, client) => {
  console.log(client);
  const args = message.content.split(' ');
  const game = args[2];
  let newOwner = args[3];

  const guildId = message.guild.id; // get the server id
  const gameKey = `${guildId}-${game}`; // prefix the game name with the server id

  // Fetch the party from the database
  const party = await db.get(gameKey);

  // Check if a party with the given title exists
  if (!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }

  let memberIndex;

  // Check if the user is the host of the party
  if (party.creator !== message.author.tag) {
    message.channel.send(`Only the host can transfer ownership.`);
    return;
  }

  // Check if the new owner is specified by number or by username
  if (isNaN(newOwner)) {
    // Find by username
    memberIndex = party.members.findIndex(member => member.tag === newOwner);
  } else {
    // Find by number
    newOwner = parseInt(newOwner, 10) - 1;
    memberIndex = newOwner >= 0 && newOwner < party.members.length ? newOwner : -1;
  }

  if (memberIndex === -1) {
    message.channel.send(`${args[3]} is not in this party.`);
    return;
  }

  // Transfer ownership
const oldOwner = party.members[0];
party.members[0] = party.members[memberIndex];
party.members[memberIndex] = oldOwner;

// Also swap the members in the order array
const oldOwnerOrder = party.membersOrder[0];
party.membersOrder[0] = party.membersOrder[memberIndex];
party.membersOrder[memberIndex] = oldOwnerOrder;

  const newOwnerUser = client.users.cache.get(party.members[0].id);

  party.creator = newOwnerUser.tag;
  party.creatorAvatarURL = newOwnerUser.displayAvatarURL();

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

  // Update the party in the database
  await db.set(gameKey, party);
}
