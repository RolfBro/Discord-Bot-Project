const Database = require('@replit/database');
const db = new Database();

module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];
  const guildId = message.guild.id; // get the server id

  //Cancellation of Party
  
  // Check if a party with the given title exists
  const partyKey = `${guildId}-${game}`; // use server id as prefix to game
  const party = await db.get(partyKey);
  if (!party) {
    message.channel.send(`No party titled '${game}' found`);
    return;
  }

  // Check if the message author is the creator of the party
  if (message.author.tag !== party.creator) {
    message.channel.send('You are not the host of this party.');
    return;
  }

  // Delete the party
  await db.delete(partyKey);
  message.channel.send(`Party titled '${game}' has been cancelled`);
};
