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
		return this.rank;
	}

	public getPriceUsd()
	{
		return this.price_usd;
	}

	public getPriceBtc()
	{
		return this.price_btc;
	}

	public getVolumUsd()
	{
		return this.volume_usd;
	}

	public getMarketCapUsd()
	{
		return this.market_cap_usd;
	}

	public getAvailableSupply()
	{
		return this.available_supply;
	}

	public getTotalSupply()
	{
		return this.total_supply;
	}

	public getPercentChange1H()
	{
		return this.percent_change_1h;
	}

	public getPercentChange24H()
	{
		return this.percent_change_24h;
	}

	public getPercentChange7D()
	{
		return this.percent_change_7d;
	}

	public getLastUpdated()
	{
		return this.last_updated;
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