type api = {
    apiKey: string;
};

interface IOptions {
    sources?: string;
}

interface IResponseObj {
    endpoint: string;
    options?: IOptions;
}

class Loader {
    private baseLink: string;
    private options: api;

    constructor(baseLink: string, options: api) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp(
        response: IResponseObj,
        callback: Function = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', response.endpoint, callback, response.options);
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    makeUrl(options: IOptions, endpoint: string): string {
        const urlOptions: { [key: string]: string } = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key: string): void => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    load(method: string, endpoint: string, callback: Function, options: IOptions = {}) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => {
                callback(data);
            })
            .catch((err) => console.error(err));
    }
}

export default Loader;
