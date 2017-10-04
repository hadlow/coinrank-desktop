import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Listing } from '../models/listing.model';

@Injectable()
export class ListingsService
{
	constructor(private http: Http)
	{
		
	}

	private getRandomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	loadIndex()
	{
		return this.http.get('https://s3-us-west-1.amazonaws.com/coinrank/api/index.json?request=' + this.getRandomInt(1000000, 9999999)).map(
			(response: Response) => {
				var listings = [];
				const data = response.json();

				var global = data['global'];
				const ticker = data['ticker'];

				for(let listing of ticker)
				{
					listing.volume_usd = listing['24h_volume_usd'];
					const listingObj = new Listing(global).fromJSON(listing);

					listings.push(listingObj);
				}

				return [global, listings];
			}
		);
	}

	loadTicker()
	{
		return this.http.get('https://s3-us-west-1.amazonaws.com/coinrank/api/ticker.json?request=' + this.getRandomInt(1000000, 9999999)).map(
			(response: Response) => {
				var listings = [];
				const data = response.json();

				var global = data['global'];
				const ticker = data['ticker'];

				for(let listing of ticker)
				{
					listing.volume_usd = listing['24h_volume_usd'];
					const listingObj = new Listing(global).fromJSON(listing);

					listings.push(listingObj);
				}

				return [global, listings];
			}
		);
	}
}