/**
 * This is a collection of API methods. It is used to reduce code location from different commands.
 * @file API.js
 * @author Santosh Bhandari
 * @license MIT
 */

const { keys } = require('../config');

class API {

	constructor(client) {
		this.client = client;
	}

	makeApiRequest(url, method) {
		return this.client.helper.Miscs.request(url, method);
	}

	/**
	 * Get image from a subreddit
	 * @since 3.0.0
	 * @param {string} subreddit Name of the subreddit
	 * @returns {Promise<URL>} image URL from the subreddit.
	 */
	getRedditImage(subreddit) {
		if (!subreddit) throw `Must provide some subreddit to search for.`;
		return this.makeApiRequest(`https://imgur.com/r/${subreddit}/hot.json`)
			.then((res) => {
				const imageData = res.body.data;
				if (imageData.length < 1) return null;
				const imageDataNew = imageData.random();
				return `https://imgur.com/${imageDataNew.hash}${imageDataNew.ext.replace(/\?.*/, '')}`;
			});
	}

	/**
	 * Get information about a country.
	 * @since 3.0.0
	 * @param {string} country Country's name
	 * @returns {Promise<*>} Country's information
	 */
	getCountryInfo(country) {
		return this.makeApiRequest(`https://restcountries.eu/rest/v2/name/${country}`)
			.query({ fullText: true })
			.then(res => res.body);
	}

	/**
	 * Search for a term on oxford dictionary
	 * @since 3.0.0
	 * @param {string} term Search term
	 * @returns {Promise<*>}
	 */
	searchDictionary(term) {
		return this.makeApiRequest(`https://od-api.oxforddictionaries.com/api/v1/entries/en/${term}`)
			.set('app_id', keys.Oxford.id)
			.set('app_key', keys.Oxford.key)
			.then(res => res.body);
	}

	yodaSpeak(sentence) {
		return this.makeApiRequest('https://yoda.p.mashape.com/yoda')
			.query({ sentence: sentence })
			.set({ 'X-Mashape-Key': keys.mashape })
			.then(res => res.text);
	}

	getCatgirl(nsfw) {
		return this.makeApiRequest('https://nekos.moe/api/v1/random/image')
			.query({ nsfw: nsfw })
			.then(res => `https://nekos.brussell.me/image/${res.body.images[0].id}`);
	}

	getChuckNorrisJoke(category) {
		category = category ? `?category=${category}` : '';
		return this.makeApiRequest(`http://api.chucknorris.io/jokes/random${category}`)
			.then(res => res.body);
	}

	cowsay(text) {
		return this.makeApiRequest('http://cowsay.morecode.org/say')
			.query({
				message: text,
				format: 'json'
			})
			.then(res => res.body.cow);
	}

	getDadJoke() {
		return this.makeApiRequest('https://icanhazdadjoke.com/slack')
			.then(res => ({
				url: res.body.attachments[0].footer.split(' - <https://')[0].replace('|permalink>', '>').replace(/[<>]/gi, ''),
				joke: res.body.attachments[0].text
			})
			);
	}

	insult() {
		return this.makeApiRequest('https://insult.mattbas.org/api/insult.json')
			.then(res => JSON.parse(res.text).insult);
	}

	calculateLove(user1, user2) {
		return this.makeApiRequest('https://love-calculator.p.mashape.com/getPercentage')
			.query({
				fname: encodeURIComponent(user1),
				sname: encodeURIComponent(user2)
			})
			.set('X-Mashape-Key', this.keys.mashape)
			.then(res => res.body);
	}

	getPun() {
		return this.makeApiRequest('http://getpuns.herokuapp.com/api/random')
			.then(res => JSON.parse(res.body).Pun);
	}

	thisForThat() {
		return this.makeApiRequest('http://itsthisforthat.com/api.php?json')
			.then(res => `It's **${JSON.parse(res.text).this}** for **${JSON.parse(res.text).that}**!`);
	}

	getTrumpQuote(name) {
		return this.makeApiRequest('https://api.whatdoestrumpthink.com/api/v1/quotes/personalized')
			.query({ q: name }) // eslint-disable-line id-length
			.then(res => res.body);
	}

	searchUrbanDictionary(term) {
		return this.makeApiRequest('http://api.urbandictionary.com/v0/define')
			.query({ term: term })
			.then(res => res.body);
	}

	yesNo() {
		return this.makeApiRequest('https://yesno.wtf/api/')
			.then(res => res.body);
	}

	yomomma() {
		return this.makeApiRequest('http://api.yomomma.info/')
			.then(res => JSON.parse(res.body).joke);
	}

	advice() {
		return this.makeApiRequest('http://api.adviceslip.com/advice')
			.then(res => JSON.parse(res.text).slip.advice);
	}

	fortune() {
		return this.makeApiRequest('http://yerkee.com/api/fortune')
			.then(res => res.body.fortune.replace(/[\r\n\t]+/g, ''));
	}

	horoscope(sign) {
		// `http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`
		return this.makeApiRequest(`https://thawing-hollows-25987.herokuapp.com/api/horoscope/${sign}/today`)
			.then(res => JSON.parse(res.text));
	}

	inspire() {
		return this.makeApiRequest('http://inspirobot.me/api')
			.query({ generate: true })
			.then(res => res.text);
	}


	/* All the animals category section */
	// starts here

	getBirdImage() {
		return this.makeApiRequest('http://random.birb.pw/tweet/')
			.then(res => `https://random.birb.pw/img/${res.body}`);
	}

	getCatImage() {
		return this.makeApiRequest('http://shibe.online/api/cats')
			.then(res => res.body[0]);
	}

	getCatfact() {
		return this.makeApiRequest('https://catfact.ninja/fact')
			.then(res => res.body.fact);
	}

	getBunnyImage() {
		return this.makeApiRequest('https://api.bunnies.io/v2/loop/random/?media=gif,png')
			.then(res => res.body.media.poster);
	}

	getDogImage() {
		return this.makeApiRequest('https://dog.ceo/api/breeds/image/random')
			.then(res => res.body.message);
	}

	getDogFact() {
		return this.makeApiRequest('https://dog-api.kinduff.com/api/facts')
			.then(res => res.body);
	}

	getDuckImage() {
		return this.makeApiRequest('https://random-d.uk/api/v1/random')
			.then(res => res.body.url);
	}

	getFoxImage() {
		return this.makeApiRequest('https://randomfox.ca/floof/')
			.then(res => res.body.image);
	}

	getLionImage() {
		return this.makeApiRequest('https://animals.anidiots.guide/lion')
			.then(res => res.body.link);
	}

	getLizardImage() {
		return this.makeApiRequest('https://nekos.life/api/lizard')
			.then(res => res.body.url);
	}

	getOwlImage() {
		return this.makeApiRequest('http://pics.floofybot.moe/owl')
			.then(res => res.body.image);
	}

	getPenguinImage() {
		return this.makeApiRequest('https://animals.anidiots.guide/penguin')
			.then(res => res.body.link);
	}

	getRedPandaImage() {
		return this.makeApiRequest('https://animals.anidiots.guide/red_panda')
			.then(res => res.body.link);
	}

	getShibaImage() {
		return this.makeApiRequest('http://shibe.online/api/shibes')
			.then(res => res.body[0]);
	}

	getTigerImage() {
		return this.makeApiRequest('https://animals.anidiots.guide/tiger')
			.then(res => res.body.link);
	}
	/* Animal category ends here */

}

module.exports = API;
