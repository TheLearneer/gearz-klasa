const { Command } = require('klasa');

class NpmSearchCommand extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Search for a package on npm',
			usage: '<Package:str>',
			permissionLevel: 10
		});
		this.hidden = true;
		this.customizeResponse('Package', 'Please tell me the package you would like to search for.');
	}

	async run(msg, [packageName]) {
		const { body } = await this.client.helper.Miscs.request(`https://registry.npmjs.com/${packageName}`)
			.catch((err) => { if (err.status === 404) throw `Couldn't find any result for ${packageName}!`; });
		// Get the latest version by the dist-tags.
		const version = body.versions[body['dist-tags'].latest];
		// Get and check for any dependencies.
		let deps = version.dependencies ? Object.keys(version.dependencies) : null;
		// Grab the list of maintainers.
		let maintainers = body.maintainers.map(user => user.name);
		// If there's more than 10 maintainers, we want to truncate them down.
		if (maintainers.length > 10) {
			const len = maintainers.length - 10;
			maintainers = maintainers.slice(0, 10);
			maintainers.push(`...${len} more.`);
		}
		// Same with the dependencies.
		if (deps && deps.length > 10) {
			const len = deps.length - 10;
			deps = deps.slice(0, 10);
			deps.push(`...${len} more.`);
		}
		// Now we just need to present the data to the end user.
		const embed = this.client.helper.Miscs.getEmbed({ footer: false })
			.setAuthor(body.name, 'https://i.imgur.com/ErKf5Y0.png')
			.setDescription([
				`${body.description || 'No description.'}`,
				`**Version:** ${body['dist-tags'].latest}`,
				`**License:** ${body.license}`,
				`**Author:** ${body.author ? body.author.name : 'Unknown'}`,
				`**Modified:** ${new Date(body.time.modified).toDateString()}`,
				`**Dependencies:** ${deps && deps.length ? deps.join(', ') : 'None'}`,
				`**Download:** [${body.name}](https://www.npmjs.com/package/${packageName})`
			].join('\n'));
		return msg.sendEmbed(embed);
	}

}

module.exports = NpmSearchCommand;
