import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';

import { Listing } from './models/listing.model';
import { ListingsService } from './services/listings.service';
import { DetailService } from './services/detail.service';
import { SettingsService } from './services/settings.service';

declare var jQuery: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [CurrencyPipe]
})

export class AppComponent
{
	listings: Listing[] = [];

	searched_listings: Listing[] = [];

	filtered_listings: Listing[] = [];

	shown_listings: Listing[] = [];

	favorites: string[] = [];

	settings;

	global = [];

	opened: boolean = false;

	viewing: Listing;

	detailed = null;

	sort = 'market_cap';

	sort_direction = 'down';

	filter = [['0', '1'], ['PoW', 'PoS', 'N/A'], ['SHA256', 'Scrypt', 'X11', 'CryptoNight', 'Ethash', 'other']];

	limit = 30;

	search = '';

	data = [];

	chart: AmChart;

	chart_time = '1month';

	chart_logarithmic = false;

	listing_loading = true;

	conversion_rates = [];

	show_filters = false;

	total_volume = 0;

	constructor
	(
		private AmCharts: AmChartsService,
		private listingsService: ListingsService,
		private detailService: DetailService,
		private settingsService: SettingsService,
		private titleService: Title,
		private currencyPipe: CurrencyPipe
	)
	{
		this.settings = this.settingsService.getSettings();
		this.loadData();
		this.loadFavorites();
		this.startTooltip();

		if(this.settings[3] == 'on')
		{
			Observable.interval(1000 * 120).subscribe(x => {
				this.updateTicker();
			});
		}
	}

	ngOnDestroy()
	{
		if(this.chart)
		{
			this.AmCharts.destroyChart(this.chart);
		}
	}

	getListing(symbol)
	{
		for(let listing of this.listings)
		{
			if(listing.getSymbol() == symbol)
				return listing;
		}
	}

	initListings()
	{
		this.shown_listings = this.listings;
		this.searched_listings = this.listings;
		this.applyFilters();
	}

	loadData()
	{
		this.listingsService.loadIndex(this.settings[1]).subscribe(
			(data: any[]) => {
				this.global = data[0];
				this.listings = data[1];
				this.conversion_rates = data[2];

				this.initListings();
				this.loadTicker();
			}
		);
	}

	loadTicker()
	{
		this.listingsService.loadTicker(this.settings[1]).subscribe(
			(data: any[]) => {
				this.global = data[0];
				this.listings = data[1];
				this.conversion_rates = data[2];

				this.initListings();
			}
		);
	}

	updateTicker()
	{
		this.listingsService.loadTicker(this.settings[1]).subscribe(
			(data: any[]) => {
				this.global = data[0];
				this.listings = data[1];
				this.conversion_rates = data[2];
				this.updateViewing();

				this.shown_listings = this.listings;
				this.onSearch(this.search);
				this.applyFilters();
			}
		);
	}

	updateViewing()
	{
		if(this.viewing)
		{
			for(let listing of this.listings)
			{
				if(listing.getSymbol() == this.viewing.getSymbol())
				{
					this.viewing = listing;
					this.updateTitle(listing);
				}
			}
		}
	}

	updateTitle(listing)
	{
		var price = this.currencyPipe.transform(listing.getPrice(), this.settings[1], true, '1.2-5');
		this.titleService.setTitle(price + ' / ' + listing.getSymbol() + ' - Coinrank');
	}

	loadFavorites()
	{
		if(localStorage.getItem('favorites') != null)
			this.favorites = JSON.parse(localStorage.getItem('favorites'));
		else
			this.favorites = [];
	}

	startTooltip()
	{
		jQuery(function()
		{
			jQuery('[data-toggle="tooltip"]').tooltip();
		});
	}

	applyFilters()
	{
		var show = true;
		var default_algorithms = ['SHA256', 'Scrypt', 'X11', 'CryptoNight', 'Ethash'];
		var default_proof = ['PoW', 'PoS'];
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

			// If proof option is in proof array
			if(this.filter[1].indexOf(listing.getProof()) == -1)
				show = false;

			// Is other active and not a default algorithm
			if(this.filter[1].indexOf('N/A') != -1 && default_proof.indexOf(listing.getProof()) == -1)
				show = true;

			// If premined option is in premined array
			if(this.filter[0].indexOf(listing.getPremined()) == -1)
				show = false;

			if(show)
				listings.push(listing);
		}

		this.shown_listings = listings;
		this.sortListings();
	}

	convert(value)
	{
		return value * this.conversion_rates[this.settings[1]];
	}

	formatLargeNumber(value)
	{
		if(value < 10000)
			return value;
		else if(value < 1000000)
			return (value / 1000) + 'k';
		else
			return (value / 1000000) + 'm';
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
		this.search = search;
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
		this.total_volume = 0;

		this.detailService.getDetail(listing.getSymbol()).subscribe(
			(data: any[]) => {
				this.detailed = data;
				this.listing_loading = false;
				this.updateTitle(this.viewing);

				for(let market of this.detailed.markets)
					this.total_volume = this.total_volume + market[1];
				
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
				"conversion_rate": this.conversion_rates[this.settings[1]],
				"currency": this.settings[1],
				"balloonFunction": function(graphDataItem, graph)
				{
					var value = graphDataItem.values.value;
					return "<div style='margin:5px; font-size:12px;'><b>" + (value * graph.conversion_rate).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>" + graph.currency + "</div>";
				}
			}, {
				"valueAxis": "v2",
				"fillAlphas": 0.4,
				"valueField": "volume",
				"lineColor": "#BBB",
				"graphLineAlpha": 0,
				"conversion_rate": this.conversion_rates[this.settings[1]],
				"currency": this.settings[1],
				"balloonFunction": function(graphDataItem, graph)
				{
					var value = graphDataItem.values.value;
					return "<div style='margin:5px; font-size:12px;'><b>" + (value * graph.conversion_rate).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</b>" + graph.currency + "</div>";
				}
			}],
			"valueAxes": [{
				"id": "v1",
				"logarithmic": this.chart_logarithmic,
				"axisAlpha": 0,
				"labelsEnabled": true,
				"title": "Price (" + this.settings[1] + ")",
				"position": "left",
				"gridThickness": 0,
				"conversion_rate": this.conversion_rates[this.settings[1]],
				"labelFunction": function(value)
				{
					return Math.round(value * this.conversion_rate);
				}
			},
			{
				"id": "v2",
				"logarithmic": this.chart_logarithmic,
				"axisAlpha": 0,
				"labelsEnabled": true,
				"title": "Volume (" + this.settings[1] + ")",
				"position": "right",
				"gridThickness": 0,
				"conversion_rate": this.conversion_rates[this.settings[1]],
				"labelFunction": function(value)
				{
					if(value < 10000)
						return Math.round(value * this.conversion_rate);
					else if(value < 1000000)
						return Math.round((value * this.conversion_rate) / 1000) + 'k';
					else
						return Math.round((value * this.conversion_rate) / 1000000) + 'm';
				}
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
		this.titleService.setTitle('Coinrank');
	}

	ifActive(listing: Listing)
	{
		if(this.viewing == null)
			return false;

		return listing.getSymbol() == this.viewing.getSymbol();
	}
}