import { Serializable } from '../core/Serializable';

export class Article extends Serializable
{
	private url = '';

    private date = '';
    
	private image = '';

	private title = '';

    private source = '';
    
    private content = '';
    
	private tags = '';

	constructor()
	{
		super();
	}

	public getUrl()
	{
		return this.url;
    }
    
    public getDate()
	{
		return this.date;
    }
    
    public getImage()
	{
		return this.image;
    }
    
    public getTitle()
	{
		return this.title;
    }
    
    public getSource()
	{
		return this.source;
    }
    
    public getContent()
	{
		return this.content;
    }
    
    public getTags()
	{
		return this.tags;
	}
}