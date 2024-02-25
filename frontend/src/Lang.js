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
    welcometolibft: '어쩌구 저쩌구 LIBFT',
    title: 'test',
    ranking: '어쩌구',
    statistics: '캬캬',
    rank: '몇등?',
    history: '낄낄',
    playtime: '과연?',
    change_my_message: '응 돌아가 안해',
    change_my_avatar: '안돼 안바꿔줘',
    save_changes: '메롱',
    close: '미친',

    winning_rate: '빵빵',
    total_rounds: '띠띠',
    lose: '하하',
    win: '흑마법',
    goals_against_average: '슉슉',
    winning_percentage: '흑흑',
    average: '피신',
    highest: '크크',
    time: '삥',
    input_your_nick: '쿠쿠루삥뽕삥뽕....!',
    empty: '이소라최고',
  },

};

export function setLanguage(lang) {
  base_lang = lang;
  const change_node_list =
    Array.prototype.slice.call(document.querySelectorAll('[data-detect]'));
  change_node_list.map((v) => {
    v.textContent = multiLang[lang][v.dataset.detect];
  });
}

export function loadLanguage() {
  const change_node_list =
    Array.prototype.slice.call(document.querySelectorAll('[data-detect]'));
  change_node_list.map((v) => {
    v.textContent = multiLang[base_lang][v.dataset.detect];
  });
}
