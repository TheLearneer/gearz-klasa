const { Shard } = require('discord.js');
const { fork, setupMaster } = require('cluster');
const path = require('path');

Shard.prototype.spawn = async function spawn(waitForReady = true) {
	if (this.process) throw new Error('SHARDING_PROCESS_EXISTS', this.id);

	setupMaster({
		exec: path.resolve(this.manager.file),
		args: this.args,
		env: this.env,
		execArgv: this.execArgv
	});

	this.process = fork(this.env)
		.on('message', this._handleMessage.bind(this))
		.on('exit', this._exitListener);

	this.emit('spawn', this.process);

	if (!waitForReady) return this.process;
	await new Promise((resolve, reject) => {
		this.once('ready', resolve);
		this.once('disconnect', () => reject(new Error('SHARDING_READY_DISCONNECTED', this.id)));
		this.once('death', () => reject(new Error('SHARDING_READY_DIED', this.id)));
		setTimeout(() => reject(new Error('SHARDING_READY_TIMEOUT', this.id)), 30000);
	});
	return this.process;
};
