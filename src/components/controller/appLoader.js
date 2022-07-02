import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        //super('https://newsapi.org/v2/', {
        super('https://nodenews.herokuapp.com/', {
            apiKey: '89966e65e4e24aaeba4196875f84dd06', // получите свой ключ https://newsapi.org/
        });
    }
}

export default AppLoader;
