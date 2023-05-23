const { EmbedBuilder } = require('discord.js');


// Creation of party
const createParty = (message, parties) => {
  const args = message.content.split(' ');
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
    .setFooter({text: `Party created by ${message.author.tag}`, iconURL: message.author.displayAvatarURL()});

  message.channel.send({ embeds: [embed] });
}

module.exports = createParty;