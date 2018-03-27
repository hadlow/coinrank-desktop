import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Article } from '../models/article.model';

@Injectable()
export class NewsService
{
	constructor(private http: Http)
	{
		
	}

	loadNews()
	{
		return this.load();
	}

	private load()
	{
		return this.http.get('https://min-api.cryptocompare.com/data/news/').map(
			(response: Response) => {
				var news = [];
				const data = response.json();

                for(let article of data)
				{
					const articleObj = new Article().fromJSON(article);

					news.push(articleObj);
				}

				return news;
			}
		);
	}
}