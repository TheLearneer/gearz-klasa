const { Command } = require('klasa');
const animalChoices = 'bird|birb|bunny|cat|kitten|dog|puppy|duck|fox|lion|lizard|owl|hoot|penguin|redpanda|shiba|tiger';

class AnimalCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: '',
			usage: `[${animalChoices}]`
		});
	}

	async run(msg, [animal]) {
		if (!animal) animal = animalChoices.split('|').random();
		return await msg.sendEmbed(await this.getAnimal(animal));
	}

	async getAnimal(animal) {
		const embed = this.client.helper.Miscs.getEmbed();
		switch (animal.toLowerCase()) {
			case 'bird':
			case 'birb':
				embed.setImage(await this.client.helper.API.getBirdImage())
					.setTitle('Random 🐦')
					.setText('Powered by https://random.bird.pw');
				break;
			case 'bunny':
				embed.setImage(await this.client.helper.API.getBunnyImage())
					.setTitle('Random 🐰')
					.setText('Powered by https://api.bunnies.io');
				break;
			case 'cat':
			case 'kitten':
				embed.setImage(await this.client.helper.API.getCatImage())
					.setTitle('Random 🐱')
					.setText('Powered by https://shibe.online');
				break;
			case 'dog':
			case 'puppy':
				embed.setImage(await this.client.helper.API.getDogImage())
					.setTitle('Random 🐶')
					.setText('Powered by https://dog.ceo');
				break;
			case 'duck':
				embed.setImage(await this.client.helper.API.getDuckImage())
					.setTitle('Random 🦆')
					.setText('Powered by https://random-d.uk/');
				break;
			case 'fox':
				embed.setImage(await this.client.helper.API.getFoxImage())
					.setTitle('Random 🦊')
					.setText('Powered by https://randomfox.ca');
				break;
			case 'lion':
				embed.setImage(await this.client.helper.API.getLionImage())
					.setTitle('Random 🦁')
					.setText('Powered by Idiotic API');
				break;
			case 'lizard':
				embed.setImage(await this.client.helper.API.getLizardImage())
					.setTitle('Random 🦎')
					.setText('Powered by https://nekos.life');
				break;
			case 'owl':
			case 'hoot':
				embed.setImage(await this.client.helper.API.getOwlImage())
					.setTitle('Random 🦉')
					.setText('Powered by https://pics.floofybot.moe');
				break;
			case 'penguin':
				embed.setImage(await this.client.helper.API.getPenguinImage())
					.setTitle('Random 🐧')
					.setText('Powered by Idiotic API');
				break;
			case 'redpanda':
				embed.setImage(await this.client.helper.API.getRedPandaImage())
					.setTitle('Random 🐼')
					.setText('Powered by Idiotic API');
				break;
			case 'shiba':
			case 'shibe':
				embed.setImage(await this.client.helper.API.getShibaImage())
					.setTitle('Random Shiba')
					.setText('Powered by https://shibe.online');
				break;
			case 'tiger':
				embed.setImage(await this.client.helper.API.getTigerImage())
					.setTitle('Random 🐯')
					.setText('Powered by Idiotic API');
				break;
		}
		return embed;
	}

}

module.exports = AnimalCommand;
