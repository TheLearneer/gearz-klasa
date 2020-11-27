const { Argument } = require('klasa');

module.exports = class extends Argument {

	async run(arg, possible, msg) {
		const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|webp|jpeg|png)/i;
		if (msg.attachments.size && imgRegex.test(msg.attachments.first().url)) return imgRegex.exec(msg.attachments.first().url)[0].replace(/.webp$/g, '.png');
		else if (imgRegex.test(msg.content)) return imgRegex.exec(msg.content)[0].replace(/.webp$/g, '.png');
		else throw `${possible.name} Must be a message Attachment or valid image URL.`;
	}

};
