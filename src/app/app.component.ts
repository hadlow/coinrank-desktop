import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import * as d3 from 'd3';

declare var jQuery:any;

import { Listing } from "./models/listing.model";
import { ListingsService } from "./services/listings.service";
import { DetailService } from "./services/detail.service";
import { SettingsService } from "./services/settings.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent
{
	private listings: Listing[] = [];

	private shown_listings: Listing[] = [];

	private favorites: string[] = [];

	private settings;

	private global = [];

	private opened: boolean = false;

	private viewing: Listing;

	private sort = 'market_cap';

	private sort_direction = 'down';

	private limit = 30;

	curveType: string = 'Linear';
	curve = d3.curveLinear;

	colorScheme: any;
	schemeType: string = 'ordinal';
	selectedColorScheme: string;

	private data = [];

	constructor(private listingsService: ListingsService, private detailService: DetailService, private settingsService: SettingsService, private titleService: Title)
	{
		this.settings = this.settingsService.getSettings();
		this.loadData();
		this.loadFavorites();
		this.setColorScheme('cool');
		this.startTooltip();
	}

	private loadData()
	{
		this.listings = this.listingsService.getListings();
		this.global = this.listingsService.getGlobal();

		this.shown_listings = this.listings;
	}

	private loadFavorites()
	{
		if(localStorage.getItem('favorites') != null)
			this.favorites = JSON.parse(localStorage.getItem('favorites'));
		else
			this.favorites = [];
	}

	private startTooltip()
	{
		jQuery(function()
		{
			jQuery('[data-toggle="tooltip"]').tooltip();
		});
	}

	private setColorScheme(name)
	{
		this.selectedColorScheme = name;
		this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
	}

	sortListingsUp()
	{
		this.shown_listings.sort((l1, l2) => {
			if(l1.getValue(this.sort) > l2.getValue(this.sort))
				return 1;
		
			if(l1.getValue(this.sort) < l2.getValue(this.sort))
				return -1;
		
			return 0;
		});
	}

	sortListingsDown()
	{
		this.shown_listings.sort((l1, l2) => {
			if(l1.getValue(this.sort) < l2.getValue(this.sort))
				return 1;
		
			if(l1.getValue(this.sort) > l2.getValue(this.sort))
				return -1;
		
			return 0;
		});
	}

	sortListings()
	{
		if(this.sort_direction == 'down')
			this.sortListingsDown();
		
		if(this.sort_direction == 'up')
			this.sortListingsUp();
	}

	invertSort()
	{
		var new_direction = '';

		if(this.sort_direction == 'down')
			new_direction = 'up';
		
		if(this.sort_direction == 'up')
			new_direction = 'down';

		this.sort_direction = new_direction;
	}

	onSearch(search: string)
	{
		search = search.toLowerCase();
		this.shown_listings = [];

		for(let listing of this.listings)
		{
			if(listing.getName().toLowerCase().includes(search) || listing.getSymbol().toLowerCase().includes(search))
				this.shown_listings.push(listing);
		}
	}

	onSortClick(sort)
	{
		this.sort = sort;
		this.invertSort();
		this.sortListings();
	}

	onListingClick(listing: Listing)
	{
		this.opened = true;
		this.viewing = this.detailService.getDetail(listing);
	}

	onFavoriteClick(listing: Listing)
	{
		if(this.favorites.indexOf(listing.getSymbol()) > -1)
		{
			var index = this.favorites.indexOf(listing.getSymbol());
			this.favorites.splice(index, 1);
		} else {
			this.favorites.push(listing.getSymbol());
		}

		localStorage.setItem('favorites', JSON.stringify(this.favorites));

		this.sortListings();
	}

	onBackClick()
	{
		this.opened = false;
		this.viewing = null;
	}

	ifActive(listing: Listing)
	{
		if(this.viewing == null)
			return false;

		return listing.getSymbol() == this.viewing.getSymbol();
	}
}