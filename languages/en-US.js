const { Language, util } = require('klasa');

class enUSLanguage extends Language {

	constructor(...args) {
		super(...args);

		this.language = {
			/*
			 * Command related keys.
			 * Need to be translated to other languages as well
			 */

			// Command usage

			// Used in game commands
			COMMAND_QUIZ_OVER_MULTIPLE: (points, winner) => `The quiz is over. The score at the end are as follow:\n${points}\n\nThe winner is ${winner.user} with ${winner.points} points.`,
			COMMAND_QUIZ_OVER_SINGLE: (points, user) => `${user}, the quiz is over. You scored ${points}.`,
			COMMAND_QUIZ_MORE_IS_BETTER: 'Upto 10 people can play the quiz at once. To join type `join quiz`',
			COMMAND_MAFIA_QUESTION_MAFIA: 'Whom do you want to kill ?',
			COMMAND_MAFIA_QUESTION_DOCTOR: 'Whom do you want to save ?',
			COMMAND_MAFIA_QUESTION_DETECTIVE: 'Whom do you think is the Mafia ?',
			COMMAND_MAFIA_OVER: 'The Mafia has been hanged! Thanks for playing!',
			COMMAND_MAFIA_CLEARED_CITY: (mafia) => `The mafia wasn't caught and thus the mafia cleared the city... Nice job ${mafia}`,
			COMMAND_MAFIA_NO_DECISION: 'Sorry, time is up... You missed a special chance to make an important decision.',
			COMMAND_MAFIA_GET_HANGED: (user) => user ? `${user} will be hanged!` : 'No one will be hanged...',
			COMMAND_MAFIA_WHOIS_GUESS: (list, mafiaChoose, question) => `${mafiaChoose ? 'Who do you think is the mafia member ?' : question} Please type the number!\n\n${list}`,
			COMMAND_MAFIA_NIGHT_HAPPENING1: (user) => [
				`Late last night, a Mafia emerged from the dark and tried to kill ${user}`,
				'Thankfully, a doctor stepped in just in time to save the day.',
				'Who is this mysterious Mafia ?? You have 30 seconds to decide.'
			].join('\n'),
			COMMAND_MAFIA_NIGHT_HAPPENING2: (user) => [
				`Late last night, a Mafia emerged from the dark and killed poor ${user}`,
				'Sadly after that event, the final citizen left the town in fear, leaving the Mafia to rule forever.'
			].join('\n'),
			COMMAND_MAFIA_NIGHT_HAPPENING3: (user) => [
				`Late last night, a Mafia emerged from the dark and killed poor ${user}`,
				'Who is this mysterious Mafia ?? You have 30 seconds to decide.'
			].join('\n'),
			COMMAND_MAFIA_NIGHT_HAPPENING4: [
				'Late last night, a Mafia emerged from the dark. Thankfully, however, they didn\'t try to kill anyone.',
				'Who is this mysterious Mafia ?? You have 30 seconds to decide.'
			].join('\n'),
			COMMAND_MAFIA_NOT_ENOUGH: "There were not enough people in the town. The game couldn't be started.",
			COMMAND_MAFIA_NEED_MORE: 'Need at least 2 more players to start the game. To join type `join game`',
			COMMAND_GUNFIGHT_GET_READY: 'Get ready...',
			COMMAND_GUNFIGHT_NO_SELF_FIGHT: 'You may not fight yourself.',
			COMMAND_GUNFIGHT_NO_BOT_FIGHT: 'Bots may not be fought.',
			COMMAND_GUNFIGHT_DRAW: 'Looks like the Guns were jammed... Neither one was able shoot.',
			COMMAND_GUNFIGHT_VICTORY: (user) => `${user} shoot the opponent. I can see his fast fingers.`,
			COMMAND_RPS_DRAW: 'Hmm its a draw...',
			COMMAND_RPS_USER_WIN: 'You won.... But how :confused: :thinking:',
			COMMAND_RPS_BOT_WIN: 'Hurray, I won... You can\'t see me :wink:',
			COMMAND_TRIVIA_NO_CORRECT_GUESS: (answer) => `No one was able to answer it correctly. Correct answer is ${answer}`,
			COMMAND_TRIVIA_CORRECT_GUESS: (user, answer) => `${user} guessd it right! correct answer is ${answer}`,
			COMMAND_TRIVIA_NO_GUESS: (answer) => `Time is up, correct answer is: ${answer}`,
			COMMAND_CONNECT4_TURN_OF: (user) => `Its the turn of: ${user}`,
			COMMAND_CONNECT4_COLUMN_FULL: (user, column) => `${user} the column ${column} is already full please make another choice.`,
			COMMAND_INACTIVE_WIN: (winner, table) => `Due to inactivity of current user, the winner is ${winner}\n\n${table}`,
			COMMAND_GAME_DRAW: (table) => `Its a draw due to end of possible moves.\n\n${table}`,
			COMMAND_GAME_WIN: (winner, table) => `:tada: The winner is ${winner}\n\n${table}`,
			COMMAND_CHALLENGED_FOR_GAME: (gameName, challenged, challenger) => [
				`${challenged} you are challenged for a ${gameName} game by ${challenger}`,
				'Do you accept the challenge ???'
			].join('\n'),
			COMMAND_DECLINED_TO_PLAY: (decliner, challenger) => `${challenger}, Looks like ${decliner} declined...`,
			COMMAND_CANNOT_PLAY_ONESELF: "You might be really intelligent, but still this game can't be played by a single person.",
			COMMAND_BOTS_CANNOT_PLAY: "Bot's can't play such an intelligent game, find some human. :wink:",
			COMMAND_GAME_IN_PROGRESS: (gameName) => `${gameName} game is already in progress.`,
			COMMAND_MUST_MENTION_TO_PLAY: 'You must mention the user you want to play this game with.',

			// used in other general commands.
			MUSIC_QUEUE_EMPTY: 'The queue is empty...',
			COMMAND_COUNTRY_NOT_FOUND: (country) => `Data not found for: ${country}.Make sure its a valid country name with proper spellings.`,
			COMMAND_GIVEAWAY_NO_ACTIVE: "There aren't any active giveaways in this server.",
			COMMAND_GIVEAWAY_REACHED_LIMIT: 'This guild has already reached the giveaway limit of 5.',
			COMMAND_GIVEAWAY_TERMINATED: 'The giveaway has been successfully terminated. Run the command again if you change your mind to create a new giveaway.',
			COMMAND_ZODIAC_SIGN_INVALID_DATE: 'The date you entered seems invalid. Please verify if you entered it correctly.',
			COMMAND_ZODIAC_SIGN_SIGN: (month, day, sign) => `The Zodia sign for ${month}/${day} is ${sign}`,
			COMMAND_LOVECALC_LOVE_SELF: 'I am sure you love yourself 101%.',
			COMMAND_CHOOSE_NOT_ENOUGH: 'You must provide at least 2 options to choose from.',
			COMMAND_CHOOSE_PREFER: (preference) => `I prefer ${preference}`,
			COMMAND_PING: 'Ping?',
			COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
			COMMAND_INVITE: () => [
				`To add ${this.client.user.tag} to your discord guild:`,
				`<${this.client.invite}>`
			],
			COMMAND_MAGIC8_RESPONSES: [
				'Maybe.', 'Certainly not.', 'I hope so.', 'I hope not.', 'Not in your wildest dreams.', 'There is a good chance.',
				'Quite likely.', 'I think so.', 'Never!', 'Fuhgeddaboudit.', 'Ahaha! Really?!?', 'Pfft.', 'Sorry, bucko.',
				'Hell, yes.', 'Hell to the no.', 'The future is bleak.', 'The future is uncertain.', 'I would rather not say.',
				'Who cares?', 'Possibly.', 'Never, ever, ever.', 'There is a small chance.', 'Yes!'
			],

			// Command description
			COMMAND_AKINATOR_DESCRIPTION: 'Play the game of akinator with your friend.',
			COMMAND_CONNECT4_DESCRIPTION: 'Play the game of connect4 with your friend.',
			COMMAND_GUN_FIGHT_DESCRIPTION: 'Face your friend in a western gunfight.',
			COMMAND_MAFIA_DESCRIPTION: 'Who is mafia/doctor/detective ?? Will the Mafia kill them all or will the mafia get caught ??',
			COMMAND_RPS_DESCRIPTION: 'Rock... Paper... Scissors',
			COMMAND_SLOTS_DESCRIPTION: 'Time to try your luck with slots...',
			COMMAND_TRIVIA_DESCRIPTION: 'Test your trivia knowledge.',
			COMMAND_TTT_DESCRIPTION: 'Challenge your friend for a tic-tac-toe game.',
			COMMAND_QUIZ_DESCRIPTION: 'Test your general knowledge with rapid rounds of questions.',
			COMMAND_CHUCK_DESCRIPTION: 'Read a chuck norris joke',
			COMMAND_DADJOKE_DESCRIPTION: 'Read a dad joke',
			COMMAND_GARFIELD_DESCRIPTION: 'Get a garfield comic',
			COMMAND_YOMOMMA_DESCRIPTION: 'Crack a yomomma joke',
			COMMAND_ACRO_DESCRIPTION: 'Bold the first character of each word.',
			COMMAND_CURSIVE_DESCRIPTION: 'Cursive fonts looks awesome imo.',
			COMMAND_FANCY_TEXT_DESCRIPTION: 'fancy text...',
			COMMAND_PIRATE_SPEAK_DESCRIPTION: 'Talk like pirate...',
			COMMAND_TINY_TEXT_DESCRIPTION: 'Tiny text...',
			COMMAND_UPSIDE_DOWN_DESCRIPTION: 'Upside down...',
			COMMAND_ZALGOLIZE_DESCRIPTION: 'zalgolize the text...',
			COMMAND_BE_LIKE_BILL_DESCRIPTION: 'Be like bill meme...',
			COMMAND_CATGIRL_DESCRIPTION: 'Get an image of catgirl...',
			COMMAND_CHOOSE_DESCRIPTION: 'Choose an option from list of options...',
			COMMAND_CLAPIFY_DESCRIPTION: 'clapify the text',
			COMMAND_EYEIFY_DESCRIPTION: 'eyeify the text',
			COMMAND_INSULT_DESCRIPTION: 'Insult someone',
			COMMAND_LOVECALC_DESCRIPTION: 'Calculate love percentage between two people.',
			COMMAND_MAGIC8_DESCRIPTION: 'Answer the question, 8 ball style.',
			COMMAND_PUN_DESCRIPTION: 'Get a random pun',
			COMMAND_THISFORTHAT_DESCRIPTION: 'This is for that...',
			COMMAND_TRUMP_QUOTE_DESCRIPTION: 'Trump has something special to quote you with.',
			COMMAND_YESNO_DESCRIPTION: 'The bot will answer you simply in yes/no',
			COMMAND_AVATAR_DESCRIPTION: "Get to see your's someone else's avatar.",
			COMMAND_BADGE_DESCRIPTION: 'Create a badge the way you like.',
			COMMAND_PATREON_DESCRIPTION: 'Its great to know you want to support development of the bot.',
			COMMAND_BEAUTIFUL_DESCRIPTION: 'Woah this is really beautiful painting',
			COMMAND_BEST_GUESS_DESCRIPTION: 'The best guess is ... God',
			COMMAND_BOBROSS_DESCRIPTION: 'Bob ross wants to paint some image.',
			COMMAND_CLYDE_DESCRIPTION: 'Its clyde speaking itself',
			COMMAND_DELETE_DESCRIPTION: 'Delete this ...',
			COMMAND_DISABLED_DESCRIPTION: 'Not every disabled are visible',
			COMMAND_DOOR_DESCRIPTION: "I don't wanna go inside...",
			COMMAND_FACE_DESCRIPTION: 'Modify your face in different styles',
			COMMAND_FEAR_DESCRIPTION: 'I fear this thing tooo much.',
			COMMAND_GARBAGE_DESCRIPTION: 'Delete this garbage',
			COMMAND_HITLER_DESCRIPTION: 'Is worse than hitler',
			COMMAND_ILLEGAL_DESCRIPTION: 'Is now illegal...',
			COMMAND_LEGEND_DESCRIPTION: 'Is a legend',
			COMMAND_MAGIK_DESCRIPTION: 'Magik in the house...',
			COMMAND_PHONE_DESCRIPTION: 'Tried stealing your phone...',
			COMMAND_POKEGO_TEAM_DESCRIPTION: 'I know which team you belong on pokemon go.',
			COMMAND_RAINBOW_DESCRIPTION: 'Woah amazing rainbow.',
			COMMAND_ROBOT_DESCRIPTION: 'This is your robotic version.',
			COMMAND_SUPER_PUNCH_DESCRIPTION: 'I wanna puch you, superman style',
			COMMAND_THUGLIFE_DESCRIPTION: 'thug life...',
			COMMAND_WAIFU_INSULT_DESCRIPTION: 'My waifu want to insule you...',
			COMMAND_WANTED_DESCRIPTION: 'Is wanted, dead or alive...',
			COMMAND_ZODIAC_SIGN_DESCRIPTION: 'I can say you your zodiac sign.',
			COMMAND_GIVEAWAY_DESCRIPTION: 'Its giveaway time, because everyone love it.',
			COMMAND_BAN_DESCRIPTION: 'Ban a user from the server.',
			COMMAND_KICK_DESCRIPTION: 'Kick a user from the server.',
			COMMAND_PRUNE_DESCRIPTION: 'Clear some messages from the channel.',
			COMMAND_SOFTBAN_DESCRIPTION: "Kick a user and delete the user's message from past 7 days.",
			COMMAND_MUSIC_ADD_DESCRIPTION: 'Add song from youtube url or by searching.',
			COMMAND_MUSIC_JOIN_DESCRIPTION: 'Bot will join in the voice channel you are connected to.',
			COMMAND_MUSIC_LEAVE_DESCRIPTION: 'Bot will leave from the voice channel.',
			COMMAND_MUSIC_NOW_PLAYING_DESCRIPTION: 'Get information about currently playing song.',
			COMMAND_MUSIC_PAUSE_DESCRIPTION: 'Pause the currently playing music.',
			COMMAND_MUSIC_RESUME_DESCRIPTION: 'Resume the paused music.',
			COMMAND_NSFW_URBAN_DESCRIPTION: 'Search the urban dictionary for defination of a word.',
			COMMAND_BANGHEAD_DESCRIPTION: 'Bang, bang, bang my head...',
			COMMAND_BITE_DESCRIPTION: 'Bite someone',
			COMMAND_DISCORD_MEME_DESCRIPTION: 'Discord is a meme.... :P',
			COMMAND_PAT_DESCRIPTION: 'pat someone',
			COMMAND_POKE_DESCRIPTION: 'poke someone',
			COMMAND_PUNCH_DESCRIPTION: 'punch someone',
			COMMAND_SLAP_DESCRIPTION: 'slap someone',
			COMMAND_TICKLE_DESCRIPTION: 'tickle someone',
			COMMAND_SEARCH_COUNTRY_DESCRIPTION: 'search information about a country',
			COMMAND_SEARCH_DICTIONARY_DESCRIPTION: 'search information about a word in the dictionary.',
			COMMAND_SEARCH_REDDIT_DESCRIPTION: 'Search the subreddit and get some news.',

			COMMAND_DJS_DOCS_DESCRIPTION: 'Searches the Discord.js docs for your query.',
			COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',
			COMMAND_INVITE_DESCRIPTION: 'Displays the join guild link of the bot.',
			COMMAND_HELP_DESCRIPTION: 'Display help for a command.',
			COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',
			COMMAND_HELP_NO_EXTENDED: 'No extended help available.',
			COMMAND_HELP_USAGE: (usage) => `usage :: ${usage}`,
			COMMAND_HELP_EXTENDED: 'Extended Help ::',

			/*
			 * Monitor related keys...
			 * Need to be translated to other languges as well.
			 */
			MONITOR_ANTI_INVITE_NOT_ALLOWED: (user) => `🛑 ${user}, This server prohibits invites.`,
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time) => `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **"ABORT"** to abort this prompt.`,
			MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time) => `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **"CANCEL"** to cancel this prompt.`,
			MONITOR_COMMAND_HANDLER_ABORTED: 'Aborted',

			/*
			 * Inhibitor related keys...
			 * Need to be translated to other languges as well.
			 */
			INHIBITOR_COOLDOWN: (remaining) => `You have just used this command. You can use this command again in ${remaining} second${remaining === 1 ? '' : 's'}.`,
			INHIBITOR_DISABLED: 'This command is currently disabled.',
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `Insufficient permissions, missing: **${missing}**`,
			INHIBITOR_NSFW: '`🔞` You may not use NSFW commands in this channel.',
			INHIBITOR_PERMISSIONS: 'You do not have permission to use this command.',
			INHIBITOR_REQUIRED_CONFIGS: (configs) => `The guild is missing the **${configs.join(', ')}** guild setting${configs.length !== 1 ? 's' : ''} and thus the command cannot run.`,
			INHIBITOR_RUNIN: (types) => `This command is only available in ${types} channels.`,
			INHIBITOR_RUNIN_NONE: (name) => `The ${name} command is not configured to run in any channel.`,

			/*
			 * Some other keys, which need to be translated as well...
			 */
			NSFW_CONTENT_PROHIBITED: '`🔞` Sorry I Cannot display NSFW content on SFW channel.',
			FILE_TOO_LARGE: 'The file was too large to send, Sorry for the inconvenince. Please try again later...',
			AFK_USER_IS_AFK: (user, message) => [
				`${user} is **AFK**! In the mean while the user has left the following message:`,
				message
			],
			MODLOG_CHANNEL_NOT_FOUND: 'The modlog channel does not exist, did it get deleted?',
			MODLOG_NOT_CLAIMED: (prefix, caseNum) => `Responsible moderator use \`${prefix}reason ${caseNum}\` to claim this log`,
			STARBOARD_CANT_STAR_OWN: (user) => `${user}, you can't star your own messages.`,
			PREFIX_REMINDER: (prefix) => `The prefix${Array.isArray(prefix) ?
				`es for this guild are: ${prefix.map(pre => `\`${pre}\``).join(', ')}` :
				` in this guild is set to: \`${prefix}\``}`,
			REACTIONHANDLER_PROMPT: 'Which page would you like to jump to?',
			COMMANDMESSAGE_MISSING: 'Missing one or more required arguments after end of input.',
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} is a required argument.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Missing a required option: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `Your option didn't match any of the possibilities: (${possibles})`,
			MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.',


			/*
			 * Setting gateway and resolver related keys...
			 * Need to be translated to other languages as well.
			 */
			SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `The value ${data} for the key ${key} does not exist.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `The value ${data} for the key ${key} already exists.`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'You must specify the value to add or filter.',
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `The key ${key} is not an Array.`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `The key ${key} does not exist in the current data schema.`,
			SETTING_GATEWAY_INVALID_TYPE: 'The type parameter must be either add or remove.',
			RESOLVER_INVALID_CUSTOM: (name, type) => `${name} must be a valid ${type}.`,
			RESOLVER_INVALID_PIECE: (name, piece) => `${name} must be a valid ${piece} name.`,
			RESOLVER_INVALID_MESSAGE: (name) => `${name} must be a valid message id.`,
			RESOLVER_INVALID_USER: (name) => `${name} must be a mention or valid user id.`,
			RESOLVER_INVALID_MEMBER: (name) => `${name} must be a mention or valid user id.`,
			RESOLVER_INVALID_CHANNEL: (name) => `${name} must be a channel tag or valid channel id.`,
			RESOLVER_INVALID_EMOJI: (name) => `${name} must be a custom emoji tag or valid emoji id.`,
			RESOLVER_INVALID_GUILD: (name) => `${name} must be a valid guild id.`,
			RESOLVER_INVALID_ROLE: (name) => `${name} must be a role mention or role id.`,
			RESOLVER_INVALID_LITERAL: (name) => `Your option did not match the only possibility: ${name}`,
			RESOLVER_INVALID_BOOL: (name) => `${name} must be true or false.`,
			RESOLVER_INVALID_INT: (name) => `${name} must be an integer.`,
			RESOLVER_INVALID_FLOAT: (name) => `${name} must be a valid number.`,
			RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} must follow this regex pattern \`${pattern}\`.`,
			RESOLVER_INVALID_URL: (name) => `${name} must be a valid url.`,
			RESOLVER_INVALID_DATE: (name) => `${name} must be a valid date.`,
			RESOLVER_INVALID_DURATION: (name) => `${name} must be a valid duration string.`,
			RESOLVER_INVALID_TIME: (name) => `${name} must be a valid duration or date string.`,
			RESOLVER_STRING_SUFFIX: ' characters',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} must be exactly ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} must be between ${min} and ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} must be greater than ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} must be less than ${max}${suffix}.`,


			/*
			 * These keys are not necessary to be translated to another language.
			 * All because these keys can't be seen by end user and is only for developers or they are disabled in specific.
			 * But if anyone is interested to help out, its always good to have everything done to 100%
			 */
			DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',
			COMMAND_CONF_SERVER_DESCRIPTION: 'Define per-guild configuration.',
			COMMAND_CONF_SERVER: (key, list) => `**guild Configuration${key}**\n${list}`,
			COMMAND_CONF_USER_DESCRIPTION: 'Define per-user configuration.',
			COMMAND_CONF_USER: (key, list) => `**User Configuration${key}**\n${list}`,
			COMMAND_CONF_NOKEY: 'You must provide a key',
			COMMAND_CONF_NOVALUE: 'You must provide a value',
			COMMAND_CONF_GUARDED: (name) => `${util.toTitleCase(name)} may not be disabled.`,
			COMMAND_CONF_UPDATED: (key, response) => `Successfully updated the key **${key}**: \`${response}\``,
			COMMAND_CONF_KEY_NOT_ARRAY: "This key is not array type. Use the action 'reset' instead.",
			COMMAND_CONF_GET_NOEXT: (key) => `The key **${key}** does not seem to exist.`,
			COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
			COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
			COMMAND_CONF_NOCHANGE: (key) => `The value for **${key}** was already that value.`,
			COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
			COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',
			COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
			COMMAND_DISABLE_DESCRIPTION: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
			COMMAND_DISABLE_WARN: "You probably don't want to disable that, since you wouldn't be able to run any command to enable it again",
			COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
			COMMAND_EVAL_EXTENDEDHELP: [
				'The eval command evaluates code as-in, any error thrown from it will be handled.',
				'It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.',
				'The --silent flag will make it output nothing.',
				"The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.",
				'The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword.',
				'The --showHidden flag will enable the showHidden option in util.inspect.',
				"If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission."
			].join('\n'),
			COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_SENDFILE: (time, type) => `Output was too long... sent the result as a file.\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_SENDCONSOLE: (time, type) => `Output was too long... sent the result to console.\n**Type**:${type}\n${time}`,
			COMMAND_UNLOAD: (type, name) => `✅ Unloaded ${type}: ${name}`,
			COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
			COMMAND_UNLOAD_WARN: "You probably don't want to unload that, since you wouldn't be able to run any command to enable it again",
			COMMAND_TRANSFER_ERROR: '❌ That file has been transfered already or never existed.',
			COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ Successfully transferred ${type}: ${name}.`,
			COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
			COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',
			COMMAND_RELOAD: (type, name, time) => `✅ Reloaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_RELOAD_ALL: (type, time) => `✅ Reloaded all ${type}. (Took: ${time})`,
			COMMAND_RELOAD_EVERYTHING: (time) => `✅ Reloaded everything. (Took: ${time})`,
			COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',
			COMMAND_REBOOT: 'Rebooting...',
			COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',
			COMMAND_LOAD: (time, type, name) => `✅ Successfully loaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_LOAD_FAIL: 'The file does not exist, or an error occurred while loading your file. Please check your console.',
			COMMAND_LOAD_ERROR: (type, name, error) => `❌ Failed to load ${type}: ${name}. Reason:${util.codeBlock('js', error)}`,
			COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',
			COMMAND_BLACKLIST_DESCRIPTION: 'Blacklists or un-blacklists users and guilds from the bot.',
			COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
				usersAdded.length ? `**Users Added**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
				usersRemoved.length ? `**Users Removed**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
				guildsAdded.length ? `**Guilds Added**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
				guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
			].filter(val => val !== '').join('\n')
		};
	}

}

module.exports = enUSLanguage;
