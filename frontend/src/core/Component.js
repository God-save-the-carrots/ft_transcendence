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
        document.querySelector(target) = this.getHtml();
    }
}
