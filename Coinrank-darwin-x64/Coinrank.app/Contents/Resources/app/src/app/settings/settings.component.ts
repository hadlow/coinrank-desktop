import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

declare var jQuery:any;

import { SettingsService } from "../services/settings.service";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})

export class SettingsComponent
{
	settings: string[];

	currencies = [
		["USD", "United States Dollars"],
		["BTC", "Bitcoin"],
		["ETH", "Ethereum"],
		["EUR", "Euro"],
		["GBP", "Great British Pound"],
		["AUD", "Australia Dollars"],
		["BGN", "Bulgarian Lev"],
		["BRL", "Brazil Real"],
		["CAD", "Canada Dollars"],
		['CHF', 'Swiss Franc'],
		["CNY", "China Yuan Renmimbi"],
		['CZK', 'Czech Koruna'],
		["DKK", "Denmark Kroner"],
		['HKD', 'Hong Kong Dollar'],
		['HRK', 'Croatian Kuna'],
		['HUF', 'Hungarian Forint'],
		['IDR', 'Indonesian Rupiah'],
		['ILS', 'Israeli New Shekel'],
		['INR', 'Indian Rupee'],
		['JPY', 'Japanese Yen'],
		['KRW', 'South Korean Won'],
		['MXN', 'Mexican Peso'],
		['MYR', 'Malaysian Ringgit'],
		['NOK', 'Norwegian Krone'],
		['NZD', 'New Zealand Dollar'],
		['PHP', 'Philippine Peso'],
		['PLN', 'Polish Zloty'],
		['RON', 'Romanian Leu'],
		['RUB', 'Russian Ruble'],
		['SEK', 'Swedish Krona'],
		['SGD', 'Singapore Dollar'],
		['THB', 'Thai Baht'],
		['TRY', 'Turkish Lira'],
		['ZAR', 'South African Rand'],
		//["XAG", "Silver Ounces"],
		//["XAU", "Gold Ounces"],
	];
	
	constructor(private settingsService: SettingsService)
	{
		this.settings = this.settingsService.getSettings();
	}

	onFormSubmit(form: NgForm)
	{
		this.settings = [form.value.change_period, form.value.currency, this.settings[2], this.settings[3]];

		this.settingsService.setSettings(this.settings);

		jQuery("#settings").modal("hide");

		location.reload();
	}
}