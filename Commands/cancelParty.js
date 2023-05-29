const Database = require('@replit/database');
const db = new Database();

module.exports = async (message) => {
  const args = message.content.split(' ');
  const game = args[2];

  //Cancellation of Party
  
  // Check if a party with the given title exists
  const party = await db.get(game);
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
  await db.delete(game);
  message.channel.send(`Party titled '${game}' has been cancelled`);
};