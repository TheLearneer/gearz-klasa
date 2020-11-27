/**
 * @file Starboard.js
 * @author Santosh Bhandari (a.k.a Froosty)
 * @license MIT
 */

const { MessageEmbed } = require('discord.js');

/**
 * Build a embed for starboard
 * @param {*} msg D.js message instance
 * @param {number} starCount Count of stars in the message
 * @returns {MessageEmbed} D.js embed with necessary information
 */
exports.buildEmbed = (msg, starCount) => {
	const starEmote = getStarEmoji(starCount);

	const embed = new MessageEmbed()
		.setColor(0xFFAC33)
		.setDescription(msg.url)
		.addField('Author', msg.author, true)
		.addField('Channel', msg.channel, true)
		.setThumbnail(msg.author.displayAvatarURL())
		.setFooter(`${starEmote} ${starCount} | ${msg.id}`)
		.setTimestamp(msg.createdAt);
	if (msg.content) embed.addField('Message', msg.content.shortenString(1000));
	const attachment = getAttachment(msg);
	if (attachment) embed.setImage(attachment);
	return embed;
};

function getStarEmoji(count) {
	if (count < 5) return '⭐';
	if (count < 15) return '🌟';
	if (count < 30) return '🌠';
	if (count < 50) return '✨';
	if (count < 75) return '🎆';
	if (count < 100) return '☄';
	return '🌌';
}

function getAttachment(msg) {
	const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|webp|gif|png)/i;
	if (msg.attachments.size && imgRegex.test(msg.attachments.first().url)) return imgRegex.exec(msg.attachments.first().url)[0];
	else if (imgRegex.test(msg.content)) return imgRegex.exec(msg.content)[0];
	else return null;
}
