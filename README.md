# Legiondary Bot
## This is a Discord Party Creator bot launched as a mini project in order to be familiarized with the **Javascript** language. 

### The centerpiece of the project is a Discord bot that enables server users to create and manage parties. The bot's functionality is designed to foster community engagement and provide a convenient way to organize social activities within the server. 

### This bot offers users the ability to create parties with custom titles and capacity specifications. Once a party is created, it becomes open for other users to join. Once a party reaches its specified capacity, the bot sends a notification to all the members, alerting them that the party is ready to commence.

**Versions:**

++ Version 2.0 (Public Release) ++

This version brings more commands to the bot including:

* **Kick a member of the party**: Party hosts can now kick a member of the party.
* **Transfer host role**: The host role can be given to another member.
* **Resize the party**: The host now has the ability to adjust the size of the party after it has been created.
* **Mention all members**: The host can now notify all members at once, making communication within the party more efficient.
* **List all active parties**: Members can now view all active parties, allowing them to easily choose which one they want to join.

Mutliple bug fixes were also done to ensure the smooth operation of the bot.

The bot can now store its data in a Replit database instead of Map().

++ Version 1.0 ++

The bot currently supports the following commands:

* **Create a party**: Users can create a party specifying a custom title and the number of users that can join. The bot takes care of managing the party's capacity.
* **Delete a party**: The user who created a party can delete it. The bot will ensure that all references to the party are removed.
* **Join a party**: Users can join an existing party created by others. The bot will add the user to the party and manage capacity accordingly.
* **Help command**: The bot offers a help command to guide users on its functionalities. This will provide a list of available commands and a brief description of what they do.
