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
        <h1>  HI? MY NAME IS GAME </h1>
        <p> This is Game page. </p>
        `
    }
    setup(){}
    setEvent(){}
}