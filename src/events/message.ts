import * as Discord from "discord.js";
import * as Fs from "fs";
import SQLite from "better-sqlite3";

import * as Logger from "./../utils/Logger";
import * as Xp from "./../utils/Xp";

import { queue } from "../index";

// const sql = new SQLite("../../SQL/level.sqlite");

export default async (Client: Discord.Client, message: Discord.Message) => {
	if (message.author.bot || !message.guild) {
		return;
	}

	const prefix = "!";

	if (message.mentions.has(Client.user, { ignoreDirect: false, ignoreEveryone: true, ignoreRoles: true }) && message.content.split(" ").length == 1) {
		message.reply(`Hey, I'm Mango! Your current prefix is \`${prefix}\` \n→ help message: \`${prefix}help\` <a:check:745904327872217088>`);
	}

	Xp.checkXP(message);

	const msg: string = message.content;
	const args: string[] = message.content.slice(prefix.length).trim().split(" ");
	const cmd: string = args.shift().toLowerCase();

	if (!msg.startsWith(prefix)) {
		return;
	}

	let ops: {} = {
		queue: queue
	}

	try {
		require(checkFolders(cmd)).run(Client, message, args, ops);
		Logger.log(`${message.author.tag} just used the ${cmd} power in ${message.guild.name}.`);
	} catch (err) {
		Logger.log(`The command ${message.author.tag} tried to call in ${message.guild.name} doesen't seem to exist.`);
	}

	function checkFolders(command) {
		let folders = ["moderation", "fun", "music", "info", "game"];
		var files: string[];
		var finalPath: string;

		folders.forEach(folder => {
			files = Fs.readdirSync(`./src/commands/${folder}`);

			files.forEach(file => {
				if (file.split(".")[0] == command) {
					return finalPath = `./../commands/${folder}/${file.split(".")[0]}.js`;
				}
			});
		});

		return finalPath;
	}
};
