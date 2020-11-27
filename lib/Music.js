const ytdl = require('ytdl-core');
const { getVideoByID, searchVideos } = require('./Google/YoutubeAPI');

class Music {

	constructor(guild) {
		Object.defineProperty(this, 'client', { value: guild.client });
		Object.defineProperty(this, 'guild', { value: guild });

		this.recentlyPlayed = new Array(10);
		this.queue = [];

		this.dispatcher = null;
		this.status = 'idle';
		this.channel = null;
	}

	/**
	 * Makes the bot join the voice channel.
	 * @since 3.0.0
	 * @param {VoiceChannel} voiceChannel The voice channel where bot should join.
	 * @returns {VoiceChannel} The voice channel where the bot joined.
	 */
	join(voiceChannel) {
		voiceChannel.join()
			.catch(err => {
				if (String(err).includes('ECONNRESET')) throw 'There was an issue connecting to the voice channel.';
				console.log('error: ', err);
				throw err;
			});
		return voiceChannel;
	}

	/**
	 * Makes the bot leave the voice channel.
	 * @async
	 * @since 3.0.0
	 * @returns {Promise<Music>}
	 */
	async leave() {
		if (!this.voiceChannel) throw 'I am not connected to any voice channel in this server.';
		await this.voiceChannel.leave();

		this.dispatcher = null;
		this.status = 'idle';

		return this;
	}

	/**
	 * Search a video over youtube by name.
	 * @async
	 * @since 3.0.0
	 * @param {string} name The search term.
	 * @param {string} type The source where the song should be searched for.
	 * @returns {*[]} List of search result.
	 */
	async search(name, type) { // eslint-disable-line no-unused-vars
		const songs = await searchVideos(name);
		if (songs.length < 1) throw `No video found for name: ${name}`;
		const list = [];
		for (const song of songs) {
			const _id = await getVideoByID(song.id);
			list.push(_id);
		}
		return list;
	}

	/**
	 * Add a song to the queue.
	 * @since 3.0.0
	 * @async
	 * @param {User} user The user who requested the song.
	 * @param {string} id ID of the song.
	 * @param {*} options Customization options
	 * @param {boolean} options.force Whether to add the song even if it exists in recently played list
	 * @param {string} options.type The souce from where the song is to be added.
	 * @returns {Promise<false|data>}
	 */
	async add(user, id, options = {}) {
		if (!options.hasOwnProperty('force')) options.force = false;
		if (!options.hasOwnProperty('type')) options.type = 'youtube';

		// Not adding if song is already in recently played, and adding song is not forced.
		if (this.recentlyPlayed.includes(id) && !options.force) return false;

		let song = null;
		let rawSource = options.type;

		// Fetching the song information from different Sources
		switch (options.type) {
			case 'youtube':
			default:
				song = await getVideoByID(id);
				rawSource = 'youtube';
				break;
		}

		const data = {
			id: song.id,
			url: song.url,
			title: song.title,
			duration: song.length,
			requester: user,
			source: rawSource.toTitleCase()
		};

		this.queue.push(data);
		// TO-BE-DONE add the next song to the next field
		return data;
	}

	/**
	 * Play the music on the connected voice channel.
	 * @since 3.0.0
	 * @async
	 * @returns {Promise<*>}
	 */
	async play() {
		if (!this.voiceChannel) throw 'I am not in any voice Channel';
		else if (!this.connection) throw 'I could not find a connection.';
		else if (this.queue.length === 0) throw 'We\'ve run out of songs! Better queue up some more tunes.';

		const song = this.queue[0];
		this.pushPlayed(song.id);
		const stream = ytdl(song.url, { audioonly: true })
			.on('error', err => this.client.log(`Error occurred when streaming video: ${err}`, 'error'));

		this.dispatcher = this.connection.play(stream, { passes: 5 });

		return this.dispatcher;
	}

	/**
	 * Add the played music to recently played list so that it won't get repeated again shortly.
	 * @since 3.0.0
	 * @param {string} id The recently played song id.
	 */
	pushPlayed(id) {
		this.recentlyPlayed.push(id);
		this.recentlyPlayed.shift();
	}

	/**
	 * Pause the music.
	 * @since 3.0.0
	 * @returns {Music}
	 */
	pause() {
		if (this.status === 'idle') throw `I am not playing any songs currently, status: **${this.status}**`;
		else if (this.status === 'paused') throw 'Music already paused.';

		this.dispatcher.pause();
		this.status = 'paused';
		return this;
	}

	/**
	 * Resume the paused music
	 * @since 3.0.0
	 * @returns {Music}
	 */
	resume() {
		if (this.status === 'idle') throw `I am not playing any songs currently, status: **${this.status}**`;
		else if (this.status === 'playing') throw 'Music not paused.';

		this.dispatcher.resume();
		this.status = 'playing';
		return this;
	}

	/**
	 * Clear all the music in the queue
	 * @since 3.0.0
	 * @returns {Music}
	 */
	prune() {
		this.queue = [];
		return this;
	}

	// getters
	/**
	 * The voice channel bot is connected to
	 * @since 3.0.0
	 * @readonly
	 */
	get voiceChannel() {
		return this.guild.me.voiceChannel;
	}

	/**
	 * The voice connection for the guild
	 * @since 3.0.0
	 * @readonly
	 */
	get connection() {
		return this.voiceChannel ? this.voiceChannel.connection : null;
	}

}

module.exports = Music;
