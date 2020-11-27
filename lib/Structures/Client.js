const { Client } = require('klasa');
const { options, config } = require('../../config');

// Guild extension, for adding music library as a property to guild object.
require('../Extensions/guildExtension');

// custom stores
const RawEventStore = require('./Stores/RawEventStore');

// Klasa's member gateway plugin for easier member related settings....
Client.use(require('klasa-member-gateway'));

// some prototype extension for better usage and code duplication/loc reduction
require('../Prototypes/Array.prototype');
require('../Prototypes/Number.prototype');
require('../Prototypes/String.prototype');

// All the schema's are placed in seperate file for easy maintenance and cleaner codes.
require('../Schema/schema.client');
require('../Schema/schema.guild');
require('../Schema/schema.member');
require('../Schema/schema.user');

// files from /lib directoroy
const Miscs = require('../Miscs');
const APIRequester = require('../API');
const WebhookLogger = require('../WebhookLogger');

// other items ?? :thinking:
const permissionLevels = require('./permissionLevels');
options.permissionLevels = permissionLevels;

class Gearz extends Client {

	constructor() {
		super(options);

		this.config = config;

		// New store related doings...
		this.rawEvents = new RawEventStore(this);
		this.registerStore(this.rawEvents);

		// some custom helper classes
		this.helper = {
			Miscs: new Miscs(this),
			API: new APIRequester(this),
			Logger: new WebhookLogger(this)
		};
	}

}

module.exports = Gearz;
