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
	private settings: string[];

	private currencies = [
		["USD", "United States Dollars"],
		["BTC", "Bitcoin"],
		["ETH", "Ethereum"],
		["EUR", "Euro"],
		["GBP", "Great British Pound"],
		["DZD", "Algeria Dinars"],
		["ARP", "Argentina Pesos"],
		["AUD", "Australia Dollars"],
		["ATS", "Austria Schillings"],
		["BEF", "Belgium Francs"],
		["BRR", "Brazil Real"],
		["BGL", "Bulgaria Lev"],
		["CAD", "Canada Dollars"],
		["CLP", "Chile Pesos"],
		["CNY", "China Yuan Renmimbi"],
		["CYP", "Cyprus Pounds"],
		["CSK", "Czech Republic Koruna"],
		["DKK", "Denmark Kroner"],
		["NLG", "Dutch Guilders"],
		["XCD", "Eastern Caribbean Dollars"],
		["EGP", "Egypt Pounds"],
		["FJD", "Fiji Dollars"],
		["FIM", "Finland Markka"],
		["FRF", "France Francs"],
		["DEM", "Germany Deutsche Marks"],
		["XAU", "Gold Ounces"],
		["GRD", "Greece Drachmas"],
		["HKD", "Hong Kong Dollars"],
		["HUF", "Hungary Forint"],
		["ISK", "Iceland Krona"],
		["INR", "India Rupees"],
		["IDR", "Indonesia Rupiah"],
		["IEP", "Ireland Punt"],
		["ILS", "Israel New Shekels"],
		["ITL", "Italy Lira"],
		["JMD", "Jamaica Dollars"],
		["JPY", "Japan Yen"],
		["JOD", "Jordan Dinar"],
		["KRW", "Korea (South) Won"],
		["LBP", "Lebanon Pounds"],
		["LUF", "Luxembourg Francs"],
		["MYR", "Malaysia Ringgit"],
		["MXP", "Mexico Pesos"],
		["NLG", "Netherlands Guilders"],
		["NZD", "New Zealand Dollars"],
		["NOK", "Norway Kroner"],
		["PKR", "Pakistan Rupees"],
		["XPD", "Palladium Ounces"],
		["PHP", "Philippines Pesos"],
		["XPT", "Platinum Ounces"],
		["PLZ", "Poland Zloty"],
		["PTE", "Portugal Escudo"],
		["ROL", "Romania Leu"],
		["RUR", "Russia Rubles"],
		["SAR", "Saudi Arabia Riyal"],
		["XAG", "Silver Ounces"],
		["SGD", "Singapore Dollars"],
		["SKK", "Slovakia Koruna"],
		["ZAR", "South Africa Rand"],
		["KRW", "South Korea Won"],
		["ESP", "Spain Pesetas"],
		["XDR", "Special Drawing Right (IMF)"],
		["SDD", "Sudan Dinar"],
		["SEK", "Sweden Krona"],
		["CHF", "Switzerland Francs"],
		["TWD", "Taiwan Dollars"],
		["THB", "Thailand Baht"],
		["TTD", "Trinidad and Tobago Dollars"],
		["TRL", "Turkey Lira"],
		["VEB", "Venezuela Bolivar"],
		["ZMK", "Zambia Kwacha"],
		["EUR", "Euro"],
		["XCD", "Eastern Caribbean Dollars"],
		["XDR", "Special Drawing Right (IMF)"],
		["XAG", "Silver Ounces"],
		["XAU", "Gold Ounces"],
		["XPD", "Palladium Ounces"],
		["XPT", "Platinum Ounces"]
	];
	
	constructor(private settingsService: SettingsService)
	{
		this.settings = this.settingsService.getSettings();
	}

	onFormSubmit(form: NgForm)
	{
		this.settings = [form.value.change_period, form.value.currency, this.settings[2], form.value.limit];

		this.settingsService.setSettings(this.settings);

		jQuery("#settings").modal("hide");
	}
}