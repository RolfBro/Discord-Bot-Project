const { EmbedBuilder } = require('discord.js');

// Listing all active parties

module.exports = async (message, db) => {
  const guildId = message.guild.id; // get the server id

  // Fetch all keys from the database
  const keys = await db.list();

  // Filter keys for the current server
  const games = keys.filter(key => key.startsWith(`${guildId}-`));

  if (games.length === 0) {
    message.channel.send('No active parties.');
    return;
  }

  for (const gameKey of games) {
    const party = await db.get(gameKey);
    const game = gameKey.replace(`${guildId}-`, ''); // remove server id prefix to get the game name

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
  }
}
