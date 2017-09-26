import { Serializable } from '../core/Serializable';

export class Listing extends Serializable
{
	private global = [];

	private name = '';

	private symbol = '';

	private rank = '';

	private price_usd = '';

	private volume_usd = '';

	private market_cap_usd = '';

	private available_supply = '';

	private total_supply = '';

	private percent_change_1h = '';

	private percent_change_24h = '';

	private percent_change_7d = '';

	private algorithm = '';

	private proof = '';

	private premined = '';

	private random = 0;

	constructor(global)
	{
		super();
		this.global = global;
		this.getRandomInt(1000000, 9999999);
	}

	public getName()
	{
		return this.name;
	}

	public getSymbol()
	{
		return this.symbol;
	}

	public getRank()
	{
		return Number(this.rank);
	}

	public getPriceUsd()
	{
		return Number(this.price_usd);
	}

	public getVolumUsd()
	{
		return Number(this.volume_usd);
	}

	public getMarketCapUsd()
	{
		return Number(this.market_cap_usd);
	}

	public getAvailableSupply()
	{
		return Number(this.available_supply);
	}

	public getTotalSupply()
	{
		return Number(this.total_supply);
	}

	public getPercentChange1H()
	{
		return Number(this.percent_change_1h);
	}

	public getPercentChange24H()
	{
		return Number(this.percent_change_24h);
	}

	public getPercentChange7D()
	{
		return Number(this.percent_change_7d);
	}

	public getPriceChange1H()
	{
		return (Number(this.percent_change_1h) / 100) * Number(this.price_usd);
	}

	public getPriceChange24H()
	{
		return (Number(this.percent_change_24h) / 100) * Number(this.price_usd);
	}

	public getPriceChange7D()
	{
		return (Number(this.percent_change_7d) / 100) * Number(this.price_usd);
	}

	public getAlgorithm()
	{
		return this.algorithm;
	}

	public getProof()
	{
		return this.proof;
	}

	public getPremined()
	{
		return this.premined;
	}

	public getChart()
	{
		return 'https://s3-us-west-1.amazonaws.com/coinrank/charts/' + this.getSymbol() + '.png?request=' + this.random;
	}

	public getValue(type)
	{
		switch(type)
		{
			case '24h_change':
				return this.getPercentChange24H();

			case 'price':
				return this.getPriceUsd();

			case 'market_cap':
				return this.getMarketCapUsd();

			case '24h_volume':
				return this.getVolumUsd();
		}
	}

	public getColor()
	{
		if(Number(this.percent_change_24h) < 0)
			return 'danger';
		else
			return 'success';
	}

	public getDirection()
	{
		if(Number(this.percent_change_24h) < 0)
			return 'down';
		else
			return 'up';
	}

	public getMarketShare(totalMarketCap)
	{
		return (Number(this.market_cap_usd) / this.global['total_market_cap_usd']) * 100;
	}

	private getRandomInt(min, max)
	{
		this.random = Math.floor(Math.random() * (max - min + 1)) + min;
	}
}