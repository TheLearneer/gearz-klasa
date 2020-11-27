/**
 * @file giveaway.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command, TextPrompt, Usage, Duration } = require('klasa');
const Giveaway = require('../../lib/Giveaway');
const { verifyYesNo } = require('../../lib/Util');

class GiveawayCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_GIVEAWAY_DESCRIPTION'),
			subcommands: true,
			permissionLevel: 10,
			runIn: ['text'],
			usage: '<create|list:default>',
			usageDelim: ' '
		});
		this.hidden = true;
	}

	async list(msg) {
		const set = this.client.settings.giveaways.filter(giv => giv.guild === msg.guild.id);
		if (set.length < 1) return msg.sendLocale('COMMAND_GIVEAWAY_NO_ACTIVE');
		const info = [];

		for (let i = 0; i < set.length; i++) {
			info.push([
				`\`${i}.\` ${set[i].id} in channel <#${set[i].channel}> with prize **${set.prize}** and possible winners of _${set.winnerCount}_`,
				`_${set[i].users.length} Users have participated in this giveaway yet._`
			].join('\n'));
		}

		return msg.send(info.join('\n'));
	}

	async end(msg, [id]) {
		msg.send('Oops Constantly ending a giveaway is yet not possible.');
		return console.log(id);
	}

	async create(msg) {
		if (this.client.settings.giveaways.filter(giv => giv.guild === msg.guild.id).length >= 5) return msg.sendLocale('COMMAND_GIVEAWAY_REACHED_LIMIT');

		const channel = await this.verifyGivChannel(msg);
		const winnerCount = await this.verifyGivWinnerCount(msg);
		const duration = await this.verifyGivDuration(msg);
		const prize = await this.verifyGivPrize(msg);

		const informationMsg = [
			'Are you sure, you want to create new giveaway with all these information:',
			'',
			`Giveaway Channel: ${channel}`,
			`Possible Winners: ${winnerCount}`,
			`Duration: ${duration}`,
			`Prize: ${prize}`
		].join('\n');

		// Asking the user if every information is correct.
		await msg.channel.send(informationMsg);
		const userTellsYes = await verifyYesNo(msg.channel, msg.author);
		if (!userTellsYes) return msg.channel.send(msg.language.get('COMMAND_GIVEAWAY_TERMINATED'));

		// Create new giveaway instance with few basic information
		const givNew = new Giveaway()
			.setID(this.client)
			.setPrize(prize)
			.setChannel(channel.id)
			.setDuration(duration)
			.setPossibleWinners(winnerCount);

		// Sending the giveaway message embed (in which users react to participate in giveaway) in the giveaway channel
		const embed = Giveaway.getEmbed(givNew);
		const givEmbed = await channel.send(embed);

		// Adding the remaining data (guild and message id) to the giveaway instance
		givNew.setGuildMessage(givEmbed)
			.setStartTime();

		// converting the giveaway instance to proper format and save it to the client settings.
		const givData = givNew.toJSON();
		await this.client.settings.update('giveaways', givData);

		return msg.channel.send(`New giveaway (_ID:**\`${givNew.id}\`**_) has been successfully started in ${channel}`);
	}

	async verifyGivChannel(msg) {
		const _text = [
			'Enter the channel _(**name** or **mention**)_ where you want to start the giveaway.',
			'Eg: **#giveaway** or simply **giveaway**',
			'',
			'Note: `Avoid using the name if there are multiple `'
		].join('\n');

		const usage = new Usage(this.client, '<Channel:channel|cancel>')
			.customizeResponse('Channel', 'Please make sure to specify a valid text channel!');

		const _channelPrompt = new TextPrompt(msg, usage);
		const [resolved] = await _channelPrompt.run(_text);

		if (typeof resolved === 'string' && resolved === 'cancel') throw 'Okay, creating new Giveaway has been cancelled!';
		else return resolved;
	}

	async verifyGivWinnerCount(msg) {
		const _text = [
			'Enter the number of possible winners for this giveaway.',
			'',
			'Note: `Simply enter the number.`'
		].join('\n');

		const usage = new Usage(this.client, '<Winners:integer|cancel>')
			.customizeResponse('Winners', 'Please enter a valid number of winners you want to have for this giveaway!');

		const _winnersPrompt = new TextPrompt(msg, usage);
		const [resolved] = await _winnersPrompt.run(_text);

		if (typeof resolved === 'string' && resolved === 'cancel') throw 'Okay, creating new Giveaway has been cancelled!';
		else return resolved;
	}

	async verifyGivDuration(msg) {
		const _text = [
			'Enter the duration for which you want the giveaway to run.',
			'Eg. `5 hours` or `5 days` or `30 min`',
			'',
			'Note: `Giveaways can\'t be shorter than 15 minutes and longer than 4 weeks!`'
		].join('\n');

		const usage = new Usage(this.client, '<Time:duration|cancel>')
			.customizeResponse('Time', 'Please enter valid duration amount of this giveaway!');

		const _durationPrompt = new TextPrompt(msg, usage);
		const [resolved] = await _durationPrompt.run(_text);

		if (typeof resolved === 'string' && resolved === 'cancel') {
			throw 'Okay, creating new Giveaway has been cancelled!';
		} else {
			const timeParsed = Duration._parse(resolved);
			if (timeParsed < 900000) throw 'Sorry but giveaways shorter then 15 minutes aren\'t allowed at this moment.';
			if (timeParsed > 2419200000) throw 'Sorry but giveaways longer than 4 weeks aren\'t allowed at this moment.';
			return resolved;
		}
	}

	async verifyGivPrize(msg) {
		const _text = [
			'Enter the prize the users would get if they win the giveaway.',
			'Eg. `A fancy T-shirt`, `Steam Key` and so on',
			'',
			'Note: `Avoid putting tokens or keys here, instead of the token put the game/app that token belongs to.!`'
		].join('\n');

		const usage = new Usage(this.client, '<Prize:string|cancel>')
			.customizeResponse('Prize', 'Please enter a proper prize for the giveaway!');

		const _durationPrompt = new TextPrompt(msg, usage);
		const [resolved] = await _durationPrompt.run(_text);

		if (typeof resolved === 'string' && resolved === 'cancel') throw 'Okay, creating new Giveaway has been cancelled!';
		else return resolved;
	}

}

module.exports = GiveawayCommand;
