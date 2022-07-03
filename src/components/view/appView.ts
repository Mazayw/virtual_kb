import News from './news/news';
import Sources from './sources/sources';

interface INews {
    status: string;
    totalResults?: number;
    articles?: Array<IArticle>;
}

interface IArticle {
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

interface ISources {
    status: string;
    sources?: Array<ISource>;
}

interface ISource {
    readonly id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export class AppView {
    news: News;
    sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: INews) {
        const values: Array<IArticle> = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: ISources) {
        const values: Array<ISource> = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
