/**
 * @file face.js (Command)
 * @author Santosh Bhandari
 * @license GPL-3.0
 */

const Command = require('../../lib/Structures/CommandBase/Images');
const { MessageAttachment } = require('discord.js');
const faceapp = require('../../lib/Faceapp');

class FaceCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_FACE_DESCRIPTION'),
			usage: '<smile|smile2|hot|old|young|hollywood|fun-glasses|hitman|mustache-free|pan|heisenberg|female|female2|male|impression|goatee|mustache|hipster|lion|bangs|glasses|wave|makeup> [User:user|Image:image]',
			usageDelim: ' ',
			permissionLevel: 5
		});
	}

	async run(msg, [filter, user = msg.author]) {
		const { body } = await this.client.helper.Miscs.request(this.getImage(user));
		const result = await faceapp.process(body, filter);
		await msg.channel.send(new MessageAttachment(result, 'face.png'));
	}

}

module.exports = FaceCommand;
