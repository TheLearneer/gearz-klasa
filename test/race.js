const { randomEntryFromArray } = require('../lib/Util');

const racers = [
	{ id: 'Cycle', speed: 1, chances: 1 },
	{ id: 'Motorcycle', speed: 2, chances: 1 },
	{ id: 'Taxi', speed: 3, chances: 2 },
	{ id: 'Car', speed: 4, chances: 3 },
	{ id: 'MiniBus', speed: 5, chances: 5 },
	{ id: 'Bus', speed: 6, chances: 5 },
	{ id: 'train', speed: 7, chances: 6 },
	{ id: 'aeroplane', speed: 8, chances: 8 },
	{ id: 'jet', speed: 9, chances: 8 },
	{ id: 'bullet train', speed: 10, chances: 10 }
];

function perform() {
	const finalRacers = [];
	for (let i = 0; i < 5; i++) {
		let occurance = Math.floor(Math.random() * 10);
		occurance = occurance < 1 ? 1 : occurance;
		finalRacers.push(randomEntryFromArray(racers.filter(racer => racer.occurance <= occurance)));
	}
	console.log(finalRacers);
}

perform();
