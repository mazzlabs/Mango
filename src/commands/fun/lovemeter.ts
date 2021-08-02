import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * A love meter between 2 members
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "lovemeter",
    description: "Calculates love % between to users",
    category: "fun",
    options: [
        { 
            name: "user",
            type: "USER",
            description: "The user you want to test the command with",
            required: true
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const member = Client.users.cache.get(args[0]);

        const randomNumber = Math.floor(Math.random() * 10) + 1;
        let messageContent = "\n";

        for (let index = 0; index < randomNumber; index++) {
            messageContent += ":revolving_hearts:";
        }

        for (let index = 0; index < 10 - randomNumber; index++) {
            messageContent += ":black_large_square:";
        }

        const lovemeter = new Discord.MessageEmbed()
            .setTitle("Lovemeter :heart:")
            .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL())
            .setColor("#08ABF9")
            .setDescription(`Current __lovemeter__ between you and *${member}*: ${messageContent} \n→ **${randomNumber * 10}**% of love`)
            .setFooter(Client.user.username, Client.user.avatarURL())
            .setTimestamp()

        interaction.reply({ embeds: [lovemeter] });
    }
}
