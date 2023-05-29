const { EmbedBuilder } = require('discord.js');

// Listing all active parties

module.exports = (message, parties) => {

  if(parties.size === 0) {
    message.channel.send('No active parties.');
    return;
  }

  parties.forEach((party, game) => {
    // Calculate the remaining slots
    const remainingSlots = party.size - party.members.length;

    // Create an embed for each party
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle(game)
      .addFields(
        { name: 'Host', value: party.creator },
        { name: 'Remaining Slots', value: remainingSlots.toString() }
      );
    
    // Send the embed
    message.channel.send({ embeds: [embed] });
  });
  
}