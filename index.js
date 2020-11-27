const { ShardingManager } = require('discord.js');
const { keys } = require('./config');

require('./lib/Extensions/shard');

const manager = new ShardingManager(`./bot.js`, {
	totalShards: 'auto',
	token: process.env.DEV ? keys.DevToken : keys.Token, // eslint-disable-line no-process-env
	respawn: true
});

manager.on('shardCreate', shard => {
	console.log(`💠- Successfully Launched shard ${shard.id} [ ${shard.id + 1} of ${manager.totalShards} ]`);
});

manager.spawn();
