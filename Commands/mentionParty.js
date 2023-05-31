const Database = require('@replit/database');
const db = new Database();

// Mentioning all members of the party

module.exports = async (message) => {
  const guildId = message.guild.id; // get the server id

  const args = message.content.split(' ');
  const game = args[2];

  // Prefix the game name with the server id
  const gameKey = `${guildId}-${game}`;

  // Check if a party with the given title exists
  const party = await db.get(gameKey);
  if(!party) {
    message.channel.send(`No party titled '${game}' found.`);
    return;
  }

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
