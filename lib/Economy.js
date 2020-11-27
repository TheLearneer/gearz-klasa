/**
 * @file Economy.js
 * @author Santosh Bhandari
 * @license MIT
 */

/**
 * Get the XP amount for a certain level
 * @since 4.0.0
 * @param {number} level The level
 * @returns {number} XP amount
 */
function getXPForLevel(level) {
	let xp = 0;
	for (let lvl = 1; lvl < level; lvl++) {
		xp += Math.floor(lvl + (300 * Math.pow(2, lvl / 7)));
	}
	return Math.floor(xp / 4);
}

/**
 * Get the current level from the XP amount.
 * @since 4.0.0
 * @param {number} xp The xp
 * @returns {number} Level for provided XP
 */
function getLevelFromXP(xp) {
	let level = 1;

	while (true) { // eslint-disable-line no-constant-condition
		const levelXP = getXPForLevel(level + 1);
		if (xp < levelXP) break;
		level += 1;
	}

	return level;
}

/**
 * Get the XP progress values for current level
 * @since 4.0.0
 * @param {number} xp Total XP
 * @param {number} level Current level
 * @returns {*} Progress value and total value
 */
function getXPProgress(xp, level) {
	return {
		progress: xp - getXPForLevel(level),
		total: getXPForLevel(level + 1) - getXPForLevel(level)
	};
}

// This is for debugging only.
function getXPRangeForLevel(level) {
	console.log(`XP range for level 1 is ${getXPForLevel(level)} - ${getXPForLevel(level + 1) - 1}`);
}

module.exports = { getLevelFromXP, getXPForLevel, getXPProgress, getXPRangeForLevel };
