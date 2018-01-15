import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class DetailService
{
	constructor(private http: Http)
	{

	}

	private getRandomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	loadFromServer(symbol)
	{
		return this.http.get('https://s3-us-west-1.amazonaws.com/coinrank/api/detail/' + symbol + '.json?request=' + this.getRandomInt(1000000, 9999999)).map(
			(response: Response) => {
				const data = response.json();

				return data;
			}
		);
	}

	getDetail(symbol)
	{
		// Load from the server
		return this.loadFromServer(symbol);
	}
}