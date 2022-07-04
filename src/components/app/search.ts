function search(): void {
    const input = <HTMLInputElement>document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const sources = document.getElementsByClassName('sources')[0];
    const news = sources.getElementsByClassName('source__item') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < news.length; i++) {
        const a = <HTMLElement>news[i].getElementsByClassName('source__item-name')[0];
        const txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            news[i].style.display = '';
        } else {
            news[i].style.display = 'none';
        }
    }
}

export default search;
