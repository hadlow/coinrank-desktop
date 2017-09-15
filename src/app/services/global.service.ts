import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class GlobalService
{
	private global;

	constructor(private http: Http)
	{

	}

	loadFromServer()
	{
		this.global = this.http.get('https://api.coinmarketcap.com/v1/global/');
	}

	getGlobal()
	{
		// If storage is empty
		if(this.global == null)
			// Load from the server
			this.loadFromServer();
		
		// Then return the global
		return this.global;
	}
}