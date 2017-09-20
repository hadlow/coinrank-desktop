import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Listing } from '../models/listing.model';

@Injectable()
export class ListingsService
{
	private listings: Listing[] = [];

	constructor(private http: Http)
	{

	}

	loadFromServer(global)
	{
		this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=100').subscribe(
			(response: Response) => {
				const data = response.json();

				for(const listing of data)
				{
					listing.volume_usd = listing['24h_volume_usd'];
					const listingObj = new Listing(global).fromJSON(listing);

					this.listings.push(listingObj);
				}
			}
		);
	}

	getListing(id)
	{
		for(let listing of this.listings)
		{
			if(listing.getId() == id)
				return listing;
		}

		return null;
	}

	getListings(global)
	{
		// If storage is empty
		if(this.listings.length == 0)
			// Load from the server
			this.loadFromServer(global);

		// Then return the listings
		return this.listings;
	}
}