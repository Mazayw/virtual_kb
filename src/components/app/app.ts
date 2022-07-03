import AppController from '../controller/controller';
import { AppView } from '../view/appView';
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

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        document
            .querySelector('.sources')
            .addEventListener('click', (e: Event) =>
                this.controller.getNews(e, (data: INews) => this.view.drawNews(data))
            );
        this.controller.getSources((data: INews) => this.view.drawSources(data));
    }
}

export default App;
