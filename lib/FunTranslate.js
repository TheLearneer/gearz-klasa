/**
 * Translate the text replacing characters as defined.
 * @param {string} string The input string.
 * @param {*} dictionary The dictionary object that defines new letter equivalent for old letters.
 * @param {*} join The string that joins words when translated.
 * @returns {string} The translated text.
 */
function letterTranslate(string, dictionary, join = '') {
	return string.split('').map(letter => {
		if (!dictionary[letter]) return letter;
		if (Array.isArray(dictionary[letter])) return dictionary[letter].random();
		return dictionary[letter];
	}).join(join);
}

/**
 * Translate the text replacing words as defined.
 * @param {string} string The input string.
 * @param {*} dictionary The dictionary object that defines new words equivalent for old words.
 * @param {string} join The string that joins words when translated.
 * @returns {string} The translated text.
 */
function wordTranslate(string, dictionary, join = ' ') {
	return string.split(' ').map(word => {
		const strip = word.replace(/[!@#$%^&*()`~=+[\]{};:",.<>?]/g, '');
		const lower = strip.toLowerCase();
		if (!dictionary[lower]) return word;
		const replacingWord = Array.isArray(dictionary[lower]) ? dictionary[lower].random() : dictionary[lower];
		let change = word.toLowerCase().replace(lower, replacingWord);
		if (strip.charAt(0).toUpperCase() === strip.charAt(0)) change = change.replace(replacingWord.charAt(0), replacingWord.charAt(0).toUpperCase());
		if (strip.length > 1 && strip.toUpperCase() === strip) change = change.toUpperCase();
		return change;
	}).join(join);
}

/**
 * Translate the text using regex.
 * @param {string} string The input string
 * @param {*} dictionary The dictionary object that defineds new words equivalent for old words.
 * @param {*} flags The regex flags
 * @returns {string} The translated text
 */
function regexTranslate(string, dictionary, flags = '') {
	for (const expression of Object.keys(dictionary)) {
		const regex = new RegExp(expression, flags);
		string = string.replace(regex, dictionary[expression]);
	}
	return string;
}

module.exports = { letterTranslate, wordTranslate, regexTranslate };
