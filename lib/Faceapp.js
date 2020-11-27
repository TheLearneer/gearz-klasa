/**
 * @file Faceapp.js
 * @author Santosh Bhandari (a.k.a Froosty)
 * @license MIT
 */

const request = require('../lib/Request');
const crypto = require('crypto');

/**
 * Apply a filter to the specified photo.
 * @param {Buffer} file The photo which is to be processed.
 * @param {string} filterID The filter to be applied in the photo.
 * @returns {Promise<Buffer>} The processed image.
 */
async function process(file, filterID) {
	const properFilter = getProperFilterID(filterID);
	try {
		const processed = await getAvailableFilters(file);

		const finalFilter = processed.filters.filter(filt => filt.id === properFilter);
		if (!finalFilter) throw `Invalid filter !!!\nValid filters are: ${processed.filters.map(fil => fil.id).join(', ')}`;

		const filter = finalFilter[0];
		const { body } = await makeRequest(`api/v2.6/photos/${processed.code}/filters/${filter.id}`)
			.query({ cropped: filter.cropped ? 1 : 0 })
			.set('X-FaceApp-DeviceID', processed.deviceID);

		return body;
	} catch (err) {
		if (err.status === 400) {
			const errCode = err.headers ? err.headers['x-faceapp-errorcode'] : '';
			throw errCode === 'photo_no_faces' ? 'No Faces found in Photo!' : errCode === 'bad_filter_id' ? 'Invalid Filter ID!' : err;
		}
		throw err;
	}
}

const generateID = () => crypto.randomBytes(8).toString('hex');

const makeRequest = (url, method = 'get') => request[method](`https://node-03.faceapp.io/${url}`)
	.set('User-Agent', 'FaceApp/2.0.561 (Linux; Android 6.0)');

/**
 * Get list of available filters that can be processed by the API.
 * @param {Buffer} file Any buffer.... Don't know why but is needed by the API.
 * @returns {Promise<*>}
 */
async function getAvailableFilters(file) {
	const deviceID = generateID();
	try {
		const { body } = await makeRequest('api/v2.6/photos', 'post')
			.set('X-FaceApp-DeviceID', deviceID)
			.attach('file', file, 'image.png');

		const data = {
			code: body.code,
			deviceID,
			filters: body.filters.map(filt => ({
				id: filt.id,
				title: filt.title,
				cropped: filt.is_paid ? true : filt.only_cropped,
				paid: filt.is_paid
			}))
		};
		return data;
	} catch (err) {
		throw err;
	}
}

function getProperFilterID(filter) {
	switch (filter.toLowerCase()) {
		case 'smile 2':
		case 'simle_2':
		case 'smile2':
			return 'smile_2';
		case 'fun glasses':
		case 'fun_glasses':
		case 'fun-glasses':
			return 'fun_glasses';
		case 'mustache_free':
		case 'mustache free':
		case 'mustache-free':
			return 'mustache_free';
		case 'female2':
		case 'female 2':
		case 'female_2':
			return 'female_2';
		case 'no-filter':
		case 'no filter':
		case 'original':
			return 'no-filter';
		default:
			return filter.toLowerCase();
	}
}


module.exports = { process, getAvailableFilters };
