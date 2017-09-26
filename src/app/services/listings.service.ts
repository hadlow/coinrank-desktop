import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Listing } from '../models/listing.model';

@Injectable()
export class ListingsService
{
	private listings: Listing[] = [];

	private global = [];

	constructor(private http: Http)
	{
		
	}

	private getRandomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	loadFromServer()
	{
		this.http.get('https://s3-us-west-1.amazonaws.com/coinrank/api/index.json?request=' + this.getRandomInt(1000000, 9999999)).subscribe(
			(response: Response) => {
				const data = response.json();

				this.global = data['global'];
				const ticker = data['ticker'];

				for(let listing of ticker)
				{
					listing.volume_usd = listing['24h_volume_usd'];
					const listingObj = new Listing(this.global).fromJSON(listing);

					this.listings.push(listingObj);
				}
			}
		);
	}

	getListing(symbol)
	{
		for(let listing of this.listings)
		{
			if(listing.getSymbol() == symbol)
				return listing;
		}

		return null;
	}

	getListings()
	{
		return this.listings;
	}

	getGlobal()
	{
		return this.global;
	}
}