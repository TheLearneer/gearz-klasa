const Client = require('./lib/Structures/Client');
const { keys } = require('./config');

// Using dashboard hooks to emit an API.
Client.use(require('klasa-dashboard-hooks'));

// The client instance
const client = new Client();

client.login(process.env.DEV ? keys.DevToken : keys.Token); // eslint-disable-line no-process-env
