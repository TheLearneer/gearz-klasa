/**
 * @file country.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class CountryCommand extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['nation'],
			desciption: language => language.get('COMMAND_SEARCH_COUNTRY_DESCRIPTION'),
			usage: '<Country:string>'
		});
		this.customizeResponse('Country', 'Make sure to provide the name of the country you want to get information about.');
	}

	async run(msg, [countryName]) {
		try {
			const nation = (await this.client.helper.Miscs.Api.getCountryInfo(countryName))[0];

			const embed = this.client.helper.Miscs.getEmbed()
				.setTitle(`${nation.name} (${nation.alpha2Code}) :flag_${nation.alpha2Code.toLowerCase()}:`)
				.setThumbnail(`https://api.backendless.com/2F26DFBF-433C-51CC-FF56-830CEA93BF00/473FB5A9-D20E-8D3E-FF01-E93D9D780A00/files/CountryFlagsPng/${nation.alpha3Code.toLowerCase()}.png`)
				.addField('❯❯ General Information', [
					`• Capital: **${nation.capital}**`,
					`• Region: **${nation.region}**`,
					`• Sub-Region: **${nation.subregion}**`,
					`• Demonym: **${nation.demonym}**`
				].join('\n'), true)
				.addField('❯❯ Extended Information', [
					`• Population: **${nation.population}**`,
					`• Area: **${nation.area} sq.Km**`,
					`• TimeZone: **${nation.timezones[0]}**`,
					`• Native Name: **${nation.nativeName}**`
				].join('\n'), true)
				.addField('❯❯ MORE ...', [
					`• Currency: **${nation.currencies.map(cu => `${cu.name} (${cu.symbol})`)}**`,
					`• Languages: **${nation.languages.map(lan => `${lan.name} (${lan.nativeName})`).join(', ')}**`
				].join('\n'));

			msg.sendEmbed(embed);
		} catch (error) {
			throw msg.language.get('COMMAND_COUNTRY_NOT_FOUND', `**${countryName}**`);
		}
	}

}

module.exports = CountryCommand;
