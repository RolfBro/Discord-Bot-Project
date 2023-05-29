// Mentioning all members of the party

module.exports = (message, parties) => {

  const args = message.content.split(' ');
  const game = args[2];

  // Check if a party with the given title exists
  if(!parties.has(game)) {
    message.channel.send(`No party titled '${game} found.'`);
    return;
  }

  const party = parties.get(game);

  // Check if the user sending the message is the host
  if (message.author.id !== party.members[0].id) {
    message.channel.send(`Only the host can mention all party members.`);
    return;
  }

  // Create a list of mentions
  let mentionList = '';
  for (let i = 0; i < party.members.length; i++) {
    mentionList += `<@${party.members[i].id}>\n`;
  }

  // Send a message with the mentions
  message.channel.send(mentionList);
  
}