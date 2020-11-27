const { Canvas } = require('canvas-constructor');
const { get } = require('../Request');
const { getXPProgress } = require('../Economy');

/**
 * Get level image for the member
 * @param {Member} member The member instance.
 * @returns {Promise<Buffer>} The image buffer
 */
async function buildLevelImage(member) {
	const { settings: { xp, level } } = member;
	const xpProgress = getXPProgress(xp, level);

	// All the required elements ready to be inserted into the canvas.
	const xpValue = `${xpProgress.progress} / ${xpProgress.total}`;
	const { body } = await get(member.user.displayAvatarURL({ format: 'png', size: 128 }));

	/**
	 * The items ready to be inserted into the canvas are
	 * member.user.username: The member's name
	 * body: The member's avatar
	 * xp: The member's total XP (should do xp.toHumanString() while adding into canvas)
	 * level: The member's level
	 * xpValue: 101 / 102 format Progress bar in text version for player's current level xp gain
	 */
	return new Canvas(600, 150)
		.addText(member.displayName, 100, 100)
		.addText(xpValue, 50, 100)
		.addRoundImage(body, 9, 11, 128, 128, 64);
	// TO-BE-DONE
}

async function buildProfileImage(user) {
	const { settings: { profile: { bg, intro, medals } } } = user; // eslint-disable-line no-unused-vars

	const { body } = await get(user.displayAvatarURL({ format: 'png', size: 128 })); // eslint-disable-line no-unused-vars
	// TO-BE-DONE
}

module.exports = { buildLevelImage, buildProfileImage };
