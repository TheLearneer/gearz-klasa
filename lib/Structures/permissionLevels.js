const { PermissionLevels } = require('klasa');

const roles = {
	// actual patron role by bot, patron equivalent role for giveaway and such
	patron: ['372637333331378176', '438329782158229514'],
	// actual patron+ role by bot
	patron2: [],
	// actual patron++ role by bot
	patron3: [],
	// actual patron* role by bot
	patron4: [],
	// actual patron** role by bot
	patron5: [],
	// special roles for special ones
	special: []
};

// The trusted developers IDs: Santosh, Kolkies, Nightshade
const ownerIDs = ['279550792774582272', '209609796704403456', '276023671813046273'];

async function verifyMember(client, msg) {
	// TO-BE-DONE verify the broadcastEval and add Gearz-guild ID
	const returnValue = await this.client.shard.broadcastEval(`
		const guild = this.guilds.get('123456789');
		if (!guild) return null;
		const member = guild.members.fetch('${msg.author.id}');
		if (!member) return null;
		return member;
	`);
	const finalValue = returnValue.filter(val => val !== null);
	return finalValue.length < 1 ? false : finalValue[0];
}

async function checkPatron(client, msg, amount) {
	const member = await verifyMember(client, msg);
	if (!member) return false;

	switch (amount) {
		case 1:
			if (member.roles.filter(role => roles.patron.includes(role.id)).length) return true;
			break;
		case 5:
			if (member.roles.filter(role => roles.patron2.includes(role.id)).length) return true;
			break;
		case 10:
			if (member.roles.filter(role => roles.patron3.includes(role.id)).length) return true;
			break;
		case 20:
			if (member.roles.filter(role => roles.patron4.includes(role.id)).length) return true;
			break;
		case 50:
			if (member.roles.filter(role => roles.patron5.includes(role.id)).length) return true;
			break;
	}
	return false;
}

function checkDeveloper(client, msg) {
	if (ownerIDs.includes(msg.author.id)) return true;
	return false;
}

async function checkSpecial(client, msg) {
	const member = await verifyMember(client, msg);
	if (!member) return false;

	if (member.roles.filter(role => roles.special.includes(role.id)).length) return true;
	return false;
}

module.exports = new PermissionLevels()
	.add(0, () => true)
	// patron check ($1 donations)
	.add(3, async (client, msg) => await checkPatron(client, msg, 1))
	// patron+ check ($5 donations)
	.add(4, async (client, msg) => await checkPatron(client, msg, 5))
	// patron++ check ($10 donations)
	.add(5, async (client, msg) => await checkPatron(client, msg, 10))
	// patron* check ($20 donations)
	.add(6, async (client, msg) => await checkPatron(client, msg, 20))
	// patron** check ($50 donations)
	.add(7, async (client, msg) => await checkPatron(client, msg, 50))
	// special members check (moderators, translators, helpers, and so on...)
	.add(9, async (client, msg) => await checkSpecial(client, msg))
	// developer check; Trusted developers are level 10 ... Only trusted ones...
	.add(10, async (client, msg) => checkDeveloper(client, msg));
