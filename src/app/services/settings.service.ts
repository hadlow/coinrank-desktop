import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService
{
    private settings: string[] = [];

	constructor()
	{
		if(localStorage.getItem('settings') != null)
			this.settings = JSON.parse(localStorage.getItem('settings'));
		else
			this.settings = ['24h', 'USD', 'dark', '100'];
	}

	setSettings(settings)
	{
		this.settings = settings;
		localStorage.setItem('settings', JSON.stringify(settings));
	}

	getSettings()
	{
		return this.settings;
	}
}