import Component from "../core/Component.js";


export default class Profiles extends Component {
    params;
    constructor(params) {
        super ('#app');
        this.setTitle("PROFILES");
        this.params = params;
    }
    async getHtml() {
        console.log(this.params);
        return `
        <h1>  HI? MY NAME IS ${this.title} </h1>
        <p> This is ${this.title}. </p>
        `
    }
    setup(){}
    setEvent(){}
}
