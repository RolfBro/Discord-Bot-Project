const { EmbedBuilder } = require('discord.js');

module.exports = (message) => {
  const embed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle('Available Commands')
    .addFields(
      { name: '!l create [party name] [party size]', value: 'Create a new party' },
      { name: '!l cancel [party name]', value: 'Cancel an existing party' },
      { name: '!l join [party name]', value: 'Join an existing party' },
      { name: '!l kick [party name] [member]', value: 'Kick a member from the party' },
      { name: '!l transfer [party name] [new host]', value: 'Transfer the host role to another member' },
      { name: '!l resize [party name] [new size]', value: 'Resize the party' },
      { name: '!l mention [party name]', value: 'Mention all members of the party' },
      { name: '!l list', value: 'List all active parties' },
    )
    .setFooter({text: 'Use these commands to interact with the bot.'});
    
  message.channel.send({ embeds: [embed] });
};