const { Command } = require('klasa');

class RobotCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_ROBOT_DESCRIPTION'),
			usage: '[User:user|Name:str]'
		});
	}

	async run(message, [user = message.author]) {
		const name = encodeURIComponent(this.getRobotName(user));
		const img = `https://robohash.org/${name}.png?set=set${Math.floor(Math.random() * 5)}`;
		await message.sendEmbed(this.client.helper.Miscs.getEmbed({ text: 'Powered by Robohash.' }).setImage(img));
	}

	getRobotName(user) {
		if (typeof user === 'string') return user;
		else return user.username;
	}

}

module.exports = RobotCommand;
