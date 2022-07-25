import Discord from "discord.js";

import type { PrismaClient } from "@prisma/client";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "setlogchannel",
	description: "Sets the guild's log channel for Mango",
	category: "moderation",
	memberPermissions: ["MANAGE_CHANNELS"],
	options: [
		{
			name: "channel",
			type: "CHANNEL",
			description: "The channel you want to set logs to",
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], prisma: PrismaClient) {
		const logChannelID = args[0] ? args[0].replace(/\D+/g, "") : interaction.channel.id;
		const fetchChannel = (await Client.channels.fetch(logChannelID)) as Discord.TextChannel;

		if (fetchChannel.type !== "GUILD_TEXT") {
			return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
		}

		const logchannel = await prisma.logChannels.findUnique({ where: { idOfGuild: interaction.guild.id } });

		if (logchannel) {
			await prisma.logChannels.update({ where: { idOfGuild: interaction.guild.id }, data: { idOfChannel: logChannelID } });
		} else {
			await prisma.logChannels.create({
				data: {
					idOfGuild: interaction.guild.id,
					idOfChannel: logChannelID,
				},
			});
		}

		return interaction.editReply(`<:yes:835565213498736650> Successfully updated the log channel to \`#${fetchChannel.name}\`!`);
	},
};