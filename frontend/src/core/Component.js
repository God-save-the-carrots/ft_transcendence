export default class Component {
    target;
    constructor (target) {
        this.target = target;
    }
    setTitle(title){
        this.title = title;
    }
    setup(){}
    setEvent(){}
    getHtml(){return ""}
    render() {
        const elem = document.querySelector(this.target);
        const html = this.getHtml();
        if (html instanceof Promise) {
            html.then((e) => elem.innerHTML = e);
        } else {
            elem.innerHTML = html;
        }
    }
}
