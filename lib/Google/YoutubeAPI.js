/**
 * @file YoutubeAPI.js
 * @author Santosh Bhandari (a.k.a Froosty)
 * @license MIT
 */

const parseURL = require('url').parse;
const { parse, toSeconds } = require('iso8601-duration');
const { get } = require('../Request');
const { keys } = require('../../config');

const baseURL = 'https://www.googleapis.com/youtube/v3/';

function makeRequest(endpoint, options = {}) {
	options.key = keys.Youtube;
	options.safeSearch = 'strict';
	return get(`${baseURL}${endpoint}`)
		.query(options)
		.then(res => res.body)
		.catch(console.error);
}

function getNext(id) {
	return makeRequest('search', {
		part: 'snippet',
		eventType: 'completed',
		type: 'video',
		relatedToVideoId: id
	}).then(res => res.items);
}

function getVideoByID(id) {
	return makeRequest('videos', {
		id,
		part: 'snippet,contentDetails'
	}).then(res => {
		if (res.items.length < 1) throw `No youtube music found with ID: ${id}`;
		const itm = res.items[0];
		return {
			id: itm.id,
			title: itm.snippet.title,
			description: itm.snippet.description,
			thumbnail: itm.snippet.thumbnails.high.url,
			channelTitle: itm.snippet.channelTitle,
			tags: itm.snippet.tags,
			length: toSeconds(parse(itm.contentDetails.duration)),
			url: `https://www.youtube.com/watch?v=${itm.id}`,
			shortURL: `https://youtu.be/${itm.id}`
		};
	});
}

function getVideo(url) {
	const id = parseVideoURL(url).video;
	if (!id) throw `No video ID found in URL: ${url}`;
	return getVideoByID(id);
}

function searchVideos(name, limit = 5) {
	return makeRequest('search', {
		q: name, // eslint-disable-line id-length
		part: 'snippet',
		type: 'video',
		maxResults: limit
	}).then(res => res.items.map(itm => ({
		id: itm.id.videoId,
		title: itm.snippet.title,
		channelTitle: itm.snippet.channelTitle,
		url: `https://www.youtube.com/watch?v=${itm.id.videoId}`
	})));
}

function parseVideoURL(url) {
	const parsed = parseURL(url, true);
	switch (parsed.hostname) {
		case 'www.youtube.com':
		case 'youtube.com':
		case 'm.youtube.com': {
			const idRegex = /^[a-zA-Z0-9-_]+$/;
			if (parsed.pathname === '/watch') {
				if (!idRegex.test(parsed.query.v)) return {};
				const response = { video: parsed.query.v };
				if (parsed.query.list) response.playlist = parsed.query.list;
				return response;
			}
			return {};
		}
		case 'youtu.be':
			return { video: /^\/[a-zA-Z0-9-_]+$/.test(parsed.pathname) ? parsed.pathname.slice(1) : null };
		default:
			return {};
	}
}

module.exports = {
	makeRequest,
	getNext,
	getVideoByID,
	getVideo,
	searchVideos,
	parseVideoURL
};
