import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

declare var jQuery: any;

import { Listing } from './models/listing.model';
import { ListingsService } from './services/listings.service';
import { DetailService } from './services/detail.service';
import { SettingsService } from './services/settings.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent
{
	private listings: Listing[] = [];

	private searched_listings: Listing[] = [];

	private filtered_listings: Listing[] = [];

	private shown_listings: Listing[] = [];

	private favorites: string[] = [];

	private settings;

	private global = [];

	private opened: boolean = false;

	private viewing: Listing;

	private detailed = null;

	private sort = 'market_cap';

	private sort_direction = 'down';

	private filter = [['0', '1'], ['PoW', 'PoS', 'N/A'], ['SHA256', 'Scrypt', 'X11', 'CryptoNight', 'Ethash', 'other']];

	private limit = 30;

	private data = [];

	private chart: AmChart;

	private chart_time = '1month';

	private chart_logarithmic = false;

	private listing_loading = true;

	constructor(private AmCharts: AmChartsService, private listingsService: ListingsService, private detailService: DetailService, private settingsService: SettingsService, private titleService: Title)
	{
		this.settings = this.settingsService.getSettings();
		this.loadData();
		this.loadFavorites();
		this.startTooltip();
	}

	ngOnDestroy()
	{
		if(this.chart)
		{
			this.AmCharts.destroyChart(this.chart);
		}
	}

	private loadData()
	{
		this.listingsService.loadIndex().subscribe(
			(data: any[]) => {
				this.global = data[0];
				this.listings = data[1];

				this.initListings();
				this.loadTicker();
			}
		);
	}

	private initListings()
	{
		this.shown_listings = this.listings;
		this.searched_listings = this.listings;
		this.sortListings();
	}

	private loadTicker()
	{
		this.listingsService.loadTicker().subscribe(
			(data: any[]) => {
				this.global = data[0];
				this.listings = data[1];
				console.log(this.listings);

				this.initListings();
			}
		);
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

	private applyFilters()
	{
		var show = true;
		var default_algorithms = ['SHA256', 'Scrypt', 'X11', 'CryptoNight', 'Ethash'];
		var listings = [];

		for(let listing of this.searched_listings)
		{
			show = true;

			// If algorithm option is in algorithm array
			if(this.filter[2].indexOf(listing.getAlgorithm()) == -1)
				show = false;

			// Is other active and not a default algorithm
			if(this.filter[2].indexOf('other') != -1 && default_algorithms.indexOf(listing.getAlgorithm()) == -1)
				show = true;

			// If premined option is in premined array
			if(this.filter[0].indexOf(listing.getPremined()) == -1)
				show = false;

			// If proof option is in proof array
			if(this.filter[1].indexOf(listing.getProof()) == -1)
				show = false;

			if(show)
				listings.push(listing);
		}

		this.shown_listings = listings;
		this.sortListings();
	}

	filterActive(type, filter)
	{
		if(this.filter[type].indexOf(filter) != -1)
			return true;

		return false;
	}

	filterListings(type, filter)
	{
		var index = this.filter[type].indexOf(filter);

		// If filter does not exist
		if(index == -1)
			// Add to filter
			this.filter[type].push(filter);
		else
			// Remove from filter
			this.filter[type].splice(index, 1);

		this.applyFilters();
	}

	sortListingsUp()
	{
		this.shown_listings.sort((l1, l2) => {
			if(l1.getValue(this.sort, this.settings[0]) > l2.getValue(this.sort, this.settings[0]))
				return 1;
		
			if(l1.getValue(this.sort, this.settings[0]) < l2.getValue(this.sort, this.settings[0]))
				return -1;
		
			return 0;
		});
	}

	sortListingsDown()
	{
		this.shown_listings.sort((l1, l2) => {
			if(l1.getValue(this.sort, this.settings[0]) < l2.getValue(this.sort, this.settings[0]))
				return 1;
		
			if(l1.getValue(this.sort, this.settings[0]) > l2.getValue(this.sort, this.settings[0]))
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
		this.searched_listings = [];

		for(let listing of this.listings)
		{
			if(listing.getName().toLowerCase().includes(search) || listing.getSymbol().toLowerCase().includes(search))
				this.searched_listings.push(listing);
		}

		this.applyFilters();
	}

	onSortClick(sort)
	{
		this.sort = sort;
		this.invertSort();
		this.sortListings();
	}

	onChartClick(time)
	{
		this.chart_time = time;
		this.createChart();
	}

	onLogarithmicClick(logarithmic)
	{
		this.chart_logarithmic = logarithmic;
		this.createChart();
	}

	onListingClick(listing: Listing)
	{
		this.opened = true;
		this.viewing = listing;
		this.listing_loading = true;

		this.detailService.getDetail(listing.getSymbol()).subscribe(
			(data: any[]) => {
				this.detailed = data;
				this.listing_loading = false;
				
				this.createChart();
			}
		);
	}

	createChart()
	{
		this.chart = this.AmCharts.makeChart("chartdiv", {
			"type": "serial",
			"theme": this.settings['2'],
			"marginRight": 0,
			"dataProvider": this.detailed.history[this.chart_time],
			"graphs": [{
				"valueAxis": "v1",
				"fillAlphas": 0.4,
				"valueField": "price",
				"lineColor": "#23c493",
				"graphLineAlpha": 0,
				"balloonText": "<div style='margin:5px; font-size:12px;'>$<b>[[value]]</b></div>"
			}, {
				"valueAxis": "v2",
				"fillAlphas": 0.4,
				"valueField": "volume",
				"lineColor": "#BBB",
				"graphLineAlpha": 0,
				"balloonText": "<div style='margin:5px; font-size:12px;'>$<b>[[value]]</b></div>"
			}],
			"valueAxes": [{
				"id": "v1",
				"logarithmic": this.chart_logarithmic,
				"axisAlpha": 0,
				"labelsEnabled": true,
				"title": "Price",
				"position": "left",
				"gridThickness": 0
			},
			{
				"id": "v2",
				"logarithmic": this.chart_logarithmic,
				"axisAlpha": 0,
				"labelsEnabled": true,
				"title": "Volume",
				"position": "right",
				"gridThickness": 0
			}],
			"chartCursor": {
				"categoryBalloonDateFormat": "L:NNA, MMM D YYYY",
				"cursorPosition": "mouse"
			},
			"categoryField": "date",
			"categoryAxis": {
				"minPeriod": "ss",
				"gridThickness": 0,
				"parseDates": true
			},
			"export": {
				"enabled": false,
			}
		});
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