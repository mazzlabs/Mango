import Discord from "discord.js";

import { insertLog } from "../../utils/LogChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "mute",
	description: "Mutes a user",
	category: "moderation",
	botPermissions: ["MANAGE_ROLES"],
	memberPermissions: ["MANAGE_ROLES", "MANAGE_MESSAGES"],
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user I have to mute",
			required: true,
		},

		{
			name: "reason",
			type: "STRING",
			description: "The reason of the mute",
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		const memberMute = await interaction.guild.members.fetch(args[0]);

		if (!memberMute) {
			return interaction.editReply("You specified an invalid user to mute. Please tag him in order to mute them.");
		}

		let muteRole = interaction.guild.roles.cache.find((role) => role.name === "muted");

		if (!muteRole) {
			try {
				muteRole = await interaction.guild.roles.create({
					name: "muted",
					mentionable: false,
					permissions: [],
					color: "#524F4F",
				});
			} catch (error) {
				interaction.editReply("Sorry, but I got an unexcepted error while creating the role. " + +`\`\`\`${error.message}\`\`\``);
			}
		}

		interaction.guild.channels.cache.forEach(async (channel: Discord.GuildChannel) => {
			await channel.permissionOverwrites.edit(muteRole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
			});
		});

		await memberMute.roles.add(muteRole);

		const reason = args[1] === undefined ? "no reason specified." : args[1];

		interaction.editReply(`**${memberMute.user.tag}** has been muted for: *${reason}*. <:yes:835565213498736650>`);

		insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberMute.user.tag}** has been __muted__ by ${interaction.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
	},
};