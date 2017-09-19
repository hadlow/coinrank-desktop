import { Serializable } from '../core/Serializable';

export class Listing extends Serializable
{
	private global = [];

	private id = '';

	private name = '';

	private symbol = '';

	private rank = '';

	private price_usd = '';

	private price_btc = '';

	private volume_usd = '';

	private market_cap_usd = '';

	private available_supply = '';

	private total_supply = '';

	private percent_change_1h = '';

	private percent_change_24h = '';

	private percent_change_7d = '';

	private last_updated = '';

	constructor(global)
	{
		super();
		this.global = global;
	}

	public getId()
	{
		return this.id;
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

	public getPriceBtc()
	{
		return Number(this.price_btc);
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

	public getLastUpdated()
	{
		return this.last_updated;
	}

	public getValue(type)
	{
		switch(type)
		{
			case '24h_change':
				return this.getPercentChange24H();

			case 'price':
				return this.getPriceBtc();

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
}