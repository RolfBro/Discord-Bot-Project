module.exports = (message, parties) => {
  const args = message.content.split(' ');
  const game = args[2];

  //Cancellation of Party
  
  // Check if a party with the given title exists
  if (!parties.has(game)) {
    message.channel.send(`No party titled '${game}' found`);
    return;
  }

  const party = parties.get(game);

  // Check if the message author is the creator of the party
  if (message.author.tag !== party.creator) {
    message.channel.send('You are not the creator of this party.');
    return;
  }

  // Delete the party
  parties.delete(game);
  message.channel.send(`Party titled '${game}' has been cancelled`);
};