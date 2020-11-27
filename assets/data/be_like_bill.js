// TO-BE-DONE find be like bill messages
const billTalks = [
	'{user} helps people around.'
];

function getBillTalks(name) {
	return billTalks.random().replace(/{user}/gi, name);
}

module.exports = { billTalks, getBillTalks };
