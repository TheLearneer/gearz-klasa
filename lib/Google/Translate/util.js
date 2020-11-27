const languages = {
	// TO-BE-DONE add all language codes
	auto: 'Automatic'
};

/**
 * Check if the input language code is valid for translate or not.
 * @param {string} lang The input raw language code
 * @returns {string|boolean} Valid language key.
 */
function checkValidLanguage(lang) {
	return languages[lang.toLowerCase()] || false;
}

async function getToken(text) { // eslint-disable-line no-unused-vars
	// TO-BE-DONE
}

module.exports = { languages, checkValidLanguage, getToken };
