import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Mod command

/**
 * Deletes several messages at once.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "clear",
    description: "Deletes several messages at once",
    category: "moderation",
    botPermissions: ["MANAGE_MESSAGES"],
    memberPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "number",
            type: "STRING",
            description: "The number of messages to delete",
            required: true
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
        const channel = interaction.channel as unknown as Discord.TextChannel;

        if (args.length > 0) {
            if (!isNaN(parseInt(args[0], 10)) && parseInt(args[0], 10) >= 1 && parseInt(args[0], 10) <= 100) {
                channel.bulkDelete(parseInt(args[0], 10)).then(() => {
                    return interaction.editReply(`<:yes:835565213498736650> Successfully deleted ${args[0]} messages!`);
                }).catch(() => interaction.editReply("I don't have the permission to delete messages."));
                LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${args[0]}** messages got deleted in *${interaction.channel}* by ${interaction.member.user.tag}`);

            } else {
                interaction.editReply("Invlid number provided. Only provided number between 1 and 100");
            }

        } else {
            interaction.editReply("Please enter the number of messages to delete!");
        }
    }
}
