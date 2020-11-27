/**
 * @file YoutubeAPI.js
 * @author Santosh Bhandari (a.k.a Froosty)
 * @license MIT
 * @note: All the error thrown in this file are based on the discord bot framework klasa's language system.
 * 		  Actual Error values can be found in languages/en-US.js file.
 */

const { checkValidLanguage, getToken } = require('./util');

async function translate(text, options = {}) {
	if (typeof options !== 'object') throw 'GOOGLE_TRANSLATE_MUST_BE_OBJECT';
	if (!options.hasOwnProperty('from')) options.from = 'auto';
	if (!options.hasOwnProperty('to')) throw 'GOOGLE_TRANSLATE_MUST_PROVIDE_TO_VALUE';

	// checking if the language codes are strings....
	if (typeof options.from !== 'string') throw 'GOOGLE_TRANSLATE_MUST_BE_VALID_LANGUAGE';
	if (typeof options.to !== 'string') throw 'GOOGLE_TRANSLATE_MUST_BE_VALID_LANGUAGE';

	// checking if the provided language code is available in the google translate API's supported language codes.
	const [from, to] = [checkValidLanguage(options.from), checkValidLanguage(options.to)];
	if (!from || !to) throw 'GOOGLE_TRANSLATE_NOT_VALID_LANGUAGE_CODES';

	// Fetching a token for translating the text.
	const token = await getToken(text); // eslint-disable-line no-unused-vars

	// TO-BE-DONE actually translate the text and return the translated text.
}

module.exports = { translate };
