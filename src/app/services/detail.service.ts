import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Listing } from '../models/listing.model';

@Injectable()
export class DetailService
{
	private listing: Listing;

	constructor(private http: Http)
	{

	}

	loadFromServer()
	{
		this.http.get('https://api.coinmarketcap.com/v1/global/');
	}

	getDetail(listing: Listing)
	{
		if(this.listing == null)
			// Load from the server
			this.loadFromServer();
		
		// Then return the listing
		return this.listing;
	}
}