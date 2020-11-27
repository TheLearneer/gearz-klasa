/**
 * Delay the entire process by specified ms.
 * @param {number} ms Time in ms.
 * @returns {Promise<*>}
 */
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get a random integer value in the provided range.
 * @since 3.0.0
 * @param {number} min Minimum value of the range.
 * @param {number} max Maximum value of the range.
 * @returns {number} Random value in the range.
 */
function randomInt(min = 1, max = 100) {
	if (typeof min !== 'number') throw new TypeError('Miminum for the range must be integer.');
	if (typeof max !== 'number') throw new TypeError('Maximum for the range must be integer.');
	if (max <= min) throw new Error('Can\'t determine the range if min >= max.');
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verify if the user responded with yes or no.
 * @since 3.0.0
 * @param {Channel} channel The d.js channel instance.
 * @param {User} user The d.js user instance.
 * @param {number} time The time limit to wait for the response.
 * @returns {boolean} Where user choosed yes, no or none.
 */
async function verifyYesNo(channel, user, time = 30000) {
	// The terms accepted as yes and no alternatives...
	const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea'];
	const no = ['no', 'n', 'nah', 'nope'];

	const filter = res => {
		const value = res.content.toLowerCase();
		return res.author.id === user.id && (yes.includes(value) || no.includes(value));
	};
	const verify = await channel.awaitMessages(filter, { max: 1, time });
	if (!verify.size) return 0;
	const choice = verify.first().content.toLowerCase();
	if (yes.includes(choice)) return true;
	return false;
}

/**
 * Get players that decided to join the game.
 * @param {*} msg D.js message instance
 * @param {number} min Minimum players needed
 * @param {number} max Maximum players that can attend
 * @param {*} options Custom options
 * @param {string} options.text Text users need to enter to join the game.
 * @param {number} options.time Time limit for the users to join the game.
 * @returns {*} Collection of users who decided to get in the game
 */
async function awaitPlayers(msg, min, max, options) {
	// Basis options handling
	if (typeof options !== 'object') options = {};
	if (options.text && typeof options.text !== 'string') throw new Error('The text value must be string...');
	if (options.time && typeof options.time !== 'number') throw new Error('Time must be numbers in ms...');

	if (!options.hasOwnProperty('text')) options.text = 'join game';
	if (!options.hasOwnProperty('time')) options.time = 30000;

	// actual player awaiting
	const joined = [msg.author.id];
	const filter = (res) => {
		if (res.author.bot) return false;
		if (joined.includes(res.author.id)) return false;
		if (res.content.toLowerCase() !== options.text.toLowerCase()) return false;
		joined.push(res.author.id);
		return true;
	};

	const players = msg.channel.awaitMessages(filter, { max, time: options.time });
	players.set(msg.id, msg);
	if (players.size < min) return false;
	return players.map(player => player.author);
}

/**
 * Parse the duration timestamp and provide formatted string.
 * @since 4.0.0
 * @param {number} duration The duration timestamp.
 * @param {boolean} [showIn=false] Where to display "In" or not.
 * @returns {string} The parsed duration string.
 * @example
 * const { getDuration } = require('../path/to/this_file');
 * console.log(getDuration(216000000, true))
 * // Output will be "In 2 days and 12 hours"
 */
function getDuration(duration, showIn = false) {
	const data = [];
	const inString = showIn ? 'In ' : '';
	duration /= 1000;

	const hour = Math.floor(duration / 60 / 60 % 24);
	const min = Math.floor(duration / 60 % 60);
	const sec = Math.floor(duration % 60);
	if (sec >= 1) data.push(`${sec} sec${sec > 1 ? 's' : ''}`);
	if (min >= 1) data.push(`${min} min${min > 1 ? 's' : ''}`);
	if (hour >= 1) data.push(`${hour} hour${hour > 1 ? 's' : ''}`);

	duration /= 60 * 60 * 24;

	const days = Math.floor(duration % 365 % 30 % 7);
	const week = Math.floor(duration % 365 % 30 / 7);
	if (days >= 1) data.push(`${days} day${days > 1 ? 's' : ''}`);
	if (week >= 1) data.push(`${week} week${week > 1 ? 's' : ''}`);

	if (duration >= 27) {
		if (duration < 46) return `${inString}a month`;
		else if (duration < 320) return `${inString}${Math.round(duration / 30)} months`;
		else if (duration < 548) return `${inString}a year`;
		return `${inString}${Math.round(duration / 365)} years`;
	}
	return `${inString}${data.reverse().slice(0, 2).join(' and ')}`;
}

/**
 * Get a random date in between the specified range
 * @since 4.0.0
 * @param {number} start The timestamp since when date can be fetched
 * @param {number} end The timestamp upto which date can be fetched
 * @returns {Date} The random date between the possible range.
 */
function getRandomDate(start, end) {
	end = end || Date.now();
	if (start > end) throw 'Please make sure starting date timestamp is lower than ending date timestamp.';
	return new Date(randomInt(start, end));
}

/**
 * Get a random unique entry from an array.
 * <INFO> This function is useful when you want unique random entries from array everytime.
 * 		 As it returns a random entry and the array without that entry.
 * 		 Next time while calling the function the filtered array can be provided.
 * </INFO>
 * @param {*} array The input array.
 * @returns {*} {randomEntry, filterdArray}
 */
function getUniqueRandom(array) {
	const randomized = array.shuffle();
	const randomEntry = randomized.shift();
	return {
		entry: randomEntry,
		array: randomized
	};
}

module.exports = { getDuration, verifyYesNo, randomInt, getRandomDate, delay, awaitPlayers, getUniqueRandom };
