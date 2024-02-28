let base_lang = 'en';

const multiLang = {
  'ko': {
    welcometolibft: '환영해 LIBFT',
    title: '테스트',
    ranking: '순위',
    statistics: '통계',
    rank: '랭크',
    history: '기록',
    playtime: '게임 시간',
    change_my_message: '메시지 바꿔줄게',
    change_my_avatar: '아바타 바꿔줄게',
    save_changes: '저장',
    close: '닫기',
    winning_rate: '득점률',
    total_rounds: '총 횟수',
    lose: '패배',
    win: '승리',
    goals_against_average: '실점률',
    winning_percentage: '승률',
    average: '평균',
    highest: '신',
    time: '시간',
    input_your_nick: '닉네임 입력해..!',
    empty: '텅 빔',
  },
  'en': {
    welcometolibft: 'Welcome to LIBFT',
    title: 'test',
    ranking: 'RANKING',
    statistics: 'statistics',
    rank: 'RANK',
    history: 'history',
    playtime: 'Play time',
    change_my_message: 'change my message',
    change_my_avatar: 'change my avatar',
    save_changes: 'Save changes',
    close: 'close',
    winning_rate: 'winning rate',
    total_rounds: 'total rounds',
    lose: 'lose',
    win: 'win',
    goals_against_average: 'goals against average',
    winning_percentage: 'winning percentage',
    average: 'average',
    highest: 'highest',
    time: 'TIME',
    input_your_nick: 'Input your nickname....!',
    empty: 'empty',
  },
  'cn': {
    welcometolibft: '欢迎光临 LIBFT',
    title: '试验',
    ranking: '排行',
    statistics: '统计',
    rank: '等级',
    history: '游戏历史',
    playtime: '游戏时间',
    change_my_message: '更改我的消息',
    change_my_avatar: '更改我的头像',
    save_changes: '保存变更',
    close: '闭',
    winning_rate: '胜率',
    total_rounds: '总轮次',
    lose: '输',
    win: '赢',
    goals_against_average: '失点',
    winning_percentage: '胜率',
    average: '平均',
    highest: '最高',
    time: '时间',
    input_your_nick: '输入您的昵称',
    empty: '空',
  },

};

export function setLanguage(lang) {
  base_lang = lang;
  const change_node_list =
    Array.prototype.slice.call(document.querySelectorAll('[data-detect]'));
  change_node_list.map((v) => {
    v.textContent = multiLang[lang][v.dataset.detect];
    if (lang === 'en') {
      v.style.fontFamily = 'Retro Gaming';
    } else if (lang === 'ko') {
      v.style.fontFamily = 'Galmuri9';
    } else if (lang === 'cn') {
      v.style.fontFamily = 'DOSPilgiMedium';
    }
  });
}

export function loadLanguage() {
  const change_node_list =
  Array.prototype.slice.call(document.querySelectorAll('[data-detect]'));
  change_node_list.map((v) => {
    v.textContent = multiLang[base_lang][v.dataset.detect];
    if (base_lang === 'en') {
      v.style.fontFamily = 'Retro Gaming';
    } else if (base_lang === 'ko') {
      v.style.fontFamily = 'Galmuri9';
    } else if (base_lang === 'cn') {
      v.style.fontFamily = 'DOSPilgiMedium';
    }
  });
}
