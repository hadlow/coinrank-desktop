import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import * as d3 from 'd3';

import { Listing } from "./models/listing.model";
import { ListingsService } from "./services/listings.service";
import { GlobalService } from "./services/global.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent
{
	private listings: Listing[] = [];

	private shown_listings: Listing[] = [];

	private global: any;

	private opened: boolean = false;

	private viewing: Listing;

	private favorites: Listing[] = [];

	private sort = 'market_cap';

	private sort_direction = 'down';

	private limit = 30;

	view = [0, 500];

	curveType: string = 'Linear';
	curve = d3.curveLinear;

	colorScheme: any;
	schemeType: string = 'ordinal';
	selectedColorScheme: string;

	private data = [
		{
		  "name": "Germany",
		  "series": [
			{
			  "name": "2010",
			  "value": 7300000
			},
			{
			  "name": "2011",
			  "value": 8940000
			},
			{
			  "name": "2012",
			  "value": 9340000
			},
			{
			  "name": "2013",
			  "value": 9820000
			}
		  ]
		}
	  ];

	constructor(private globalService: GlobalService, private listingsService: ListingsService, private titleService: Title)
	{
		this.global = this.globalService.getGlobal().subscribe(
			(response: Response) => {
				this.listings = this.listingsService.getListings(response.json());
				this.shown_listings = this.listings;

				const data = response.json();
				this.global = data;
			}
		);

		this.setColorScheme('cool');
	}

	setColorScheme(name)
	{
		this.selectedColorScheme = name;
		this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
	}

	sortListingsUp()
	{
		this.favorites.sort((l1, l2) => {
			if(l1.getValue(this.sort) > l2.getValue(this.sort))
				return 1;
		
			if(l1.getValue(this.sort) < l2.getValue(this.sort))
				return -1;
		
			return 0;
		});

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
		this.favorites.sort((l1, l2) => {
			if(l1.getValue(this.sort) < l2.getValue(this.sort))
				return 1;
		
			if(l1.getValue(this.sort) > l2.getValue(this.sort))
				return -1;
		
			return 0;
		});

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
			if(listing.getName().toLowerCase().includes(search))
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
		this.viewing = listing;
	}

	onFavoriteClick(listing: Listing)
	{
		this.favorites.push(listing);

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

		return listing.getId() == this.viewing.getId();
	}
}