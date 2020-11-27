const { Event } = require('klasa');

class KlasaReadyEvent extends Event {

	async run() {
		this.client.events.get('verbose').enable();
		if (!this.client.settings.schedules.some(schedule => schedule.taskName === 'botGuildPoster')) {
			await this.client.schedule.create('botGuildPoster', '*/30 * * * *');
		}
		// if (!this.client.settings.schedules.some(schedule => schedule.taskName === 'cleanup')) {
		//    await this.client.schedule.create('cleanup', '*/30 * * * *');
		// }
		console.log(`Ready to server ${this.client.users.size} users across ${this.client.guilds.size} guilds as ${this.client.user.tag}`);
	}

	async init() {
		this.updateCommandValues();
	}

	updateCommandValues() {
		// disabling some default commands
		this.client.commands.get('info').unload();
		this.client.commands.get('userconf').unload();
		this.client.commands.get('blacklist').unload();
		this.client.commands.get('conf').unload();
		this.client.commands.get('unload').unload();
		// hiding some admin commands
		this.client.commands.get('disable').hidden = true;
		this.client.commands.get('enable').hidden = true;
		this.client.commands.get('eval').hidden = true;
		this.client.commands.get('load').hidden = true;
		this.client.commands.get('reboot').hidden = true;
		this.client.commands.get('reload').hidden = true;
		this.client.commands.get('transfer').hidden = true;
	}

}

module.exports = KlasaReadyEvent;
/*
import Vue from 'vue';
import { VueAuthenticate } from 'vue-authenticate';

const Authenticate = new VueAuthenticate(Vue.$http, {
    baseUrl: 'https://api.runeinfo.xyz',
    tokenName: 'authorization',
    tokenPrefix: null,
    storageNamespace: '',
    bindRequestInterceptor: ($auth) => {
        $auth.$http.interceptors.request.use((config) => {
            if ($auth.isAuthenticated()) {
                config.headers.Authorization = $auth.getToken();
            } else {
                delete config.headers.Authorization;
            }
            return config;
        });
    },
    providers: {
        discord: {
            name: 'discord',
            url: '/oauth/callback',
            redirectUri: window.location.origin,
            authorizationEndpoint: 'https://discordapp.com/oauth2/authorize',
            clientId: '169116208342237184',
            requiredUrlParams: ['scope'],
            scope: ['identify', 'guilds'],
            scopeDelimiter: ' ',
            display: 'popup',
            oauthType: '2.0',
            popupOptions: { width: 498, height: 666 }
        }
    }
});

Object.defineProperty(Vue, '$auth', {
    get() {
        return Authenticate;
    }
});
Object.defineProperty(Vue.prototype, '$auth', {
    get() {
        return Authenticate;
    }
});

export default Authenticate;
*/
