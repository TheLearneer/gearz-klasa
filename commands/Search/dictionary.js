/**
 * @file dictionary.js (Command)
 * @author Santosh Bhandari
 * @license MIT
 */

const { Command } = require('klasa');

class DictionaryCommand extends Command {

	constructor(...args) {
		super(...args, {
			desciption: language => language.get('COMMAND_SEARCH_DICTIONARY_DESCRIPTION'),
			usage: '<Term:str>',
			aliases: ['define'],
			runIn: ['text']
		});
		this.customizeResponse('Term', 'Please make sure to provide some text to search on oxford dictionary.');
	}

	async run(msg, [term]) {
		try {
			const apiResponse = await this.client.helper.Miscs.Api.searchDictionary(term);
			const result = this.arrangeFetched(apiResponse);

			const output = [];
			for (let i = 0; i < result.length; i++) {
				const type = result[i];
				output.push(`\`${i + 1}\` [\`${type.type}\`] **${type.text}** \`/${type.pronunciation.spelling}/\` (${type.pronunciation.notation})`);
				for (let j = 0; j < type.entries.length; j++) {
					output.push(`${this.getStarter(type.entries.length, j + 1, result.length)} ${type.entries[j]}`);
				}
				output.push('');
			}

			output.push(`_Powered by Oxford Dictionaries_`);
			return msg.send(output.join('\n'));
		} catch (error) {
			throw `Couldn't find any results for ${term}`;
		}
	}

	arrangeFetched(body) {
		return body.results[0].lexicalEntries.map(len => {
			const temp = {
				type: len.lexicalCategory,
				text: len.text,
				pronunciation: {
					notation: len.pronunciations[0].phoneticNotation,
					spelling: len.pronunciations[0].phoneticSpelling
				},
				entries: []
			};
			len.entries.map(ent => ent.senses.map(sen => { // eslint-disable-line array-callback-return
				if (sen.definitions) temp.entries.push(sen.definitions[0]);
			}));
			return temp;
		});
	}

	getStarter(total, current, types) {
		if (types === 1 && current < total) return `\`├──\``;
		if (total === 1) return `\`└──\``;
		if (current === 1) return `\`└─┬\``;
		if (current < total) return `\`​  ├\``; // eslint-disable-line no-irregular-whitespace
		if (types === 1 && current === total) return `\`└──\``;
		return `\`​  └\``; // eslint-disable-line no-irregular-whitespace
	}

}

module.exports = DictionaryCommand;
