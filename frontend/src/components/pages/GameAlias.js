// import Component from '../../core/Component.js';
//
// export default class GameAlias extends Component {
//   _title;
//   _intra_id;
//   _my_css = '../../../public/assets/css/gameAlias.css';
//   constructor(target) {
//     super(target);
//     this._title = 'GameAlias';
//   }
//   // async mounted() {
//   //   setTimeout(() => {
//   //     this.props('test');
//   //   }, 1000);
//   // }
//   setEvent() {
//   }
//   async template() {
//     return `
//     <link rel="stylesheet" href="${this._my_css}" type="text/css" />
//     <div class='alias inputbox'> 
//       <div class='typewriter'>
//         <h1> Please, input your nickname!</h1>
//       </div>
//       <div class="nickname-box">
//         <input type="text" id='textInput' class="form-control form-control-lg"
//           placeholder="NickName" aria-label=".form-control-lg example"
//           onkeypress="checkKeyPress(event)">
//       </div>
//     </div>
//     `;
//   }
// }
//
import Component from '../../core/Component.js';

export default class GameAlias extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/gameAlias.css';

  constructor(target) {
    super(target);
    this._title = 'GameAlias';
  }

  setEvent() {
    // 엔터 키 입력을 감지하고 처리할 이벤트 리스너를 등록합니다.
    document.getElementById('textInput').addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  async template() {
    return `
    <link rel="stylesheet" href="${this._my_css}" type="text/css" />
    <div class='alias inputbox'> 
      <div class='typewriter'>
        <h1> Please, input your nickname!</h1>
      </div>
      <div class="nickname-box">
        <input type="text" id='textInput' class="form-control form-control-lg"
          placeholder="NickName" aria-label=".form-control-lg example">
      </div>
    </div>
    `;
  }

  // 엔터 키 입력을 처리하는 메서드입니다.
  handleKeyPress(event) {
    if (event.keyCode === 13) {
      const inputText = event.target.value;
      // console.log("입력된 텍스트:", inputText);
      this.props(inputText);
      // 이 부분에서 원하는 작업을 수행하세요.
    }
  }
}
