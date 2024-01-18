import Component from "../core/Component.js";

export default class Stats extends Component {
    params;
    constructor(params) {
        super ('#app');
        this.setTitle("STATS");
        this.params = params;
    }
    async getHtml() {
        return `
        <h1>  HI? MY NAME IS ${this.title} </h1>
        <p> This is ${this.title}. </p>
        `
    }
    setup(){}
    setEvent(){}
}
