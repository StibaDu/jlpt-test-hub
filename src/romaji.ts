// Kana → Romaji (standard Hepburn). Zero deps.
const HIRAGANA: Record<string, string> = {
  あ:'a', い:'i', う:'u', え:'e', お:'o',
  か:'ka', き:'ki', く:'ku', け:'ke', こ:'ko',
  が:'ga', ぎ:'gi', ぐ:'gu', げ:'ge', ご:'go',
  さ:'sa', し:'shi', す:'su', せ:'se', そ:'so',
  ざ:'za', じ:'ji', ず:'zu', ぜ:'ze', ぞ:'zo',
  た:'ta', ち:'chi', つ:'tsu', て:'te', と:'to',
  だ:'da', ぢ:'ji', づ:'zu', で:'de', ど:'do',
  な:'na', に:'ni', ぬ:'nu', ね:'ne', の:'no',
  は:'ha', ひ:'hi', ふ:'fu', へ:'he', ほ:'ho',
  ば:'ba', び:'bi', ぶ:'bu', べ:'be', ぼ:'bo',
  ぱ:'pa', ぴ:'pi', ぷ:'pu', ぺ:'pe', ぽ:'po',
  ま:'ma', み:'mi', む:'mu', め:'me', も:'mo',
  や:'ya', ゆ:'yu', よ:'yo',
  ら:'ra', り:'ri', る:'ru', れ:'re', ろ:'ro',
  わ:'wa', を:'o', ん:'n',
  きゃ:'kya', きゅ:'kyu', きょ:'kyo',
  しゃ:'sha', しゅ:'shu', しょ:'sho',
  ちゃ:'cha', ちゅ:'chu', ちょ:'cho',
  にゃ:'nya', にゅ:'nyu', にょ:'nyo',
  ひゃ:'hya', ひゅ:'hyu', ひょ:'hyo',
  みゃ:'mya', みゅ:'myu', みょ:'myo',
  りゃ:'rya', りゅ:'ryu', りょ:'ryo',
  ぎゃ:'gya', ぎゅ:'gyu', ぎょ:'gyo',
  じゃ:'ja', じゅ:'ju', じょ:'jo',
  びゃ:'bya', びゅ:'byu', びょ:'byo',
  ぴゃ:'pya', ぴゅ:'pyu', ぴょ:'pyo',
  ふぁ:'fa', ふぃ:'fi', ふぇ:'fe', ふぉ:'fo',
  うぁ:'wa', うぃ:'wi', うぇ:'we', うぉ:'wo',
  てぃ:'ti', とぅ:'tu', でぃ:'di', どぅ:'du',
  つぁ:'tsa', つぃ:'tsi', つぇ:'tse', つぉ:'tso',
  いぇ:'ye', きぇ:'ke',
};

const KATAKANA_MAP: Record<string, string> = {
  ア:'a', イ:'i', ウ:'u', エ:'e', オ:'o',
  カ:'ka', キ:'ki', ク:'ku', ケ:'ke', コ:'ko',
  ガ:'ga', ギ:'gi', グ:'gu', ゲ:'ge', ゴ:'go',
  サ:'sa', シ:'shi', ス:'su', セ:'se', ソ:'so',
  ザ:'za', ジ:'ji', ズ:'zu', ゼ:'ze', ゾ:'zo',
  タ:'ta', チ:'chi', ツ:'tsu', テ:'te', ト:'to',
  ダ:'da', ヂ:'ji', ヅ:'zu', デ:'de', ド:'do',
  ナ:'na', ニ:'ni', ヌ:'nu', ネ:'ne', ノ:'no',
  ハ:'ha', ヒ:'hi', フ:'fu', ヘ:'he', ホ:'ho',
  バ:'ba', ビ:'bi', ブ:'bu', ベ:'be', ボ:'bo',
  パ:'pa', ピ:'pi', プ:'pu', ペ:'pe', ポ:'po',
  マ:'ma', ミ:'mi', ム:'mu', メ:'me', モ:'mo',
  ヤ:'ya', ユ:'yu', ヨ:'yo',
  ラ:'ra', リ:'ri', ル:'ru', レ:'re', ロ:'ro',
  ワ:'wa', ヲ:'o', ン:'n',
  キャ:'kya', キュ:'kyu', キョ:'kyo',
  シャ:'sha', シュ:'shu', ショ:'sho',
  チャ:'cha', チュ:'chu', チョ:'cho',
  ニャ:'nya', ニュ:'nyu', ニョ:'nyo',
  ヒャ:'hya', ヒュ:'hyu', ヒョ:'hyo',
  ミャ:'mya', ミュ:'myu', ミョ:'myo',
  リャ:'rya', リュ:'ryu', リョ:'ryo',
  ギャ:'gya', ギュ:'gyu', ギョ:'gyo',
  ジャ:'ja', ジュ:'ju', ジョ:'jo',
  ビャ:'bya', ビュ:'byu', ビョ:'byo',
  ピャ:'pya', ピュ:'pyu', ピョ:'pyo',
  ファ:'fa', フィ:'fi', フェ:'fe', フォ:'fo',
  ティ:'ti', トゥ:'tu', ディ:'di', ドゥ:'du',
  ツァ:'tsa', ツィ:'tsi', ツェ:'tse', ツォ:'tso',
  ウィ:'wi', ウェ:'we', ウォ:'wo',
  ヴ:'vu', ヴァ:'va', ヴィ:'vi', ヴェ:'ve', ヴォ:'vo',
  シェ:'she', ジェ:'je', チェ:'che',
};

const youonHira: Record<string, [string, string]> = {
  きゃ:['き','kya'], きゅ:['き','kyu'], きょ:['き','kyo'],
  しゃ:['し','sha'], しゅ:['し','shu'], しょ:['し','sho'],
  ちゃ:['ち','cha'], ちゅ:['ち','chu'], ちょ:['ち','cho'],
  にゃ:['に','nya'], にゅ:['に','nyu'], にょ:['に','nyo'],
  ひゃ:['ひ','hya'], ひゅ:['ひ','hyu'], ひょ:['ひ','hyo'],
  みゃ:['み','mya'], みゅ:['み','myu'], みょ:['み','myo'],
  りゃ:['り','rya'], りゅ:['り','ryu'], りょ:['り','ryo'],
  ぎゃ:['ぎ','gya'], ぎゅ:['ぎ','gyu'], ぎょ:['ぎ','gyo'],
  じゃ:['じ','ja'], じゅ:['じ','ju'], じょ:['じ','jo'],
  びゃ:['び','bya'], びゅ:['び','byu'], びょ:['び','byo'],
  ぴゃ:['ぴ','pya'], ぴゅ:['ぴ','pyu'], ぴょ:['ぴ','pyo'],
};

function ch_next_romaji(twoChars: string, youon: Record<string,[string,string]>, table: Record<string,string>): string {
  return youon[twoChars] ? youon[twoChars][1] : table[twoChars.charAt(0)] || '';
}

function translitKana(input: string, table: Record<string,string>, youon: Record<string,[string,string]>, sokuonChar: string, longMark: string): string {
  let out = '';
  const chars = [...input];
  let i = 0;
  while (i < chars.length) {
    const two = chars[i] + (chars[i+1] || '');
    if (youon[two]) {
      out += youon[two][1];
      i += 2;
      continue;
    }
    const ch = chars[i];
    if (ch === sokuonChar) {
      // double the NEXT consonant (handles っきゃ → k'kya via youon table too)
      const nextTwo = chars[i+1] ? ch_next_romaji(chars[i+1] + (chars[i+2] || ''), youon, table) : '';
      const consonant = nextTwo.charAt(0);
      out += /^[a-zA-Z]+$/.test(consonant) ? consonant : '';
      i += 1;
      continue;
    }
    if (table[ch]) { out += table[ch]; i += 1; continue; }
    if (ch === longMark) {
      // vowel length: repeat previous vowel
      const last = out.slice(-1);
      if (last && /^[aeiou]$/.test(last)) out += last;
      i += 1;
      continue;
    }
    if (ch === ',' || ch === ' ') { out += ', '; i += 1; continue; }
    // katakana ー inside hiragana pass shouldn't happen; skip unknowns (kanji etc.)
    out += /[\u4E00-\u9FFF\u30FC]/.test(ch) ? '' : ch;
    i += 1;
  }
  return out;
}



/** Convert a mixed kana reading (e.g. 'つぎ,つ(ぐ)' or 'ジ,シ') to romaji. */
export function toRomaji(input?: string): string {
  if (!input) return '';
  // split on commas — each segment independently
  return input.split(',').map(seg => {
    let s = seg.trim();
    // Strip okurigana parentheses: つ(ぐ) → つぐ
    s = s.replace(/[()（）]/g, '');
    if (!s) return '';
    // all katakana → katakana table
    const hasKata = /[\u30A0-\u30FF]/.test(s);
    if (hasKata && !/[\u3040-\u309F]/.test(s)) {
      return translitKana(s, KATAKANA_MAP, youonHira, 'ッ', 'ー');
    }
    return translitKana(s, HIRAGANA, youonHira, 'っ', 'ー');
  }).filter(Boolean).join(', ');
}
