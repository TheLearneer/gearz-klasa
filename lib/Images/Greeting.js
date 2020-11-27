/* eslint-disable no-unused-vars */
const { Canvas } = require('canvas-constructor');
const { get } = require('../Request');
const fsn = require('fs-nextra');

class GreetingImageGenerator {

	/**
	 * Generate welcome/goodbye image by id, for join/leave
	 * @async
	 * @param {Member} member The member object.
	 * @param {*} object Customization object
	 * @param {string} object.id The unique image template ID.
	 * @param {boolean} object.join when the image is to be generated for user join or not.
	 * @returns {Buffer}
	 */
	getImage(member, object = { id: 'default', join: true }) {
		return this[object.id.toLowerCase()](member, object.join);
	}

	async default(member, join) {
		// TO-BE-DONE
	}

}

module.exports = GreetingImageGenerator;
