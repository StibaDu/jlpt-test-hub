// Interview Trainer dataset — based on the Meko Japanese Language School
// interview test record (25 fixed questions, part 1 聴解).
// Furigana uses the app-wide [漢字](かんじ) markup.
import type { Lang } from './types';

export interface InterviewItem {
  id: number;
  q: string;            // question with furigana markup
  qPlain: string;       // question as spoken (TTS input, plain text)
  a: string;            // model answer with furigana markup
  aPlain: string;       // model answer spoken (plain text)
  tokens: string[];     // answer word tiles in correct order
  distractors: string[];// wrong-but-plausible tiles
  meaning: Record<Lang, string>;
}

export const INTERVIEW_FREE_LIMIT = 5;

export const INTERVIEW_ITEMS: InterviewItem[] = [
  {
    id: 1,
    q: 'お[名](な)[前](まえ)は？', qPlain: 'お名前は？',
    a: 'セバスチャンです。', aPlain: 'セバスチャンです。',
    tokens: ['セバスチャン', 'です', '。'],
    distractors: ['ます', '山田', 'の'],
    meaning: { en: 'I am Sebastian. (Your name)', de: 'Ich bin Sebastian. (Dein Name)' },
  },
  {
    id: 2,
    q: '[誕生日](たんじょうび)はいつですか。', qPlain: '誕生日はいつですか。',
    a: '[四月](しがつ)[十五](じゅうご)[日](にち)です。', aPlain: '四月十五日です。',
    tokens: ['四月', '十五日', 'です', '。'],
    distractors: ['五月', '三日', 'ます'],
    meaning: { en: 'It is April 15th.', de: 'Es ist der 15. April.' },
  },
  {
    id: 3,
    q: '[電話](でんわ)[番号](ばんごう)は[何番](なんばん)ですか。', qPlain: '電話番号は何番ですか。',
    a: 'ゼロ・きゅう・ゼロの、いち・に・さん・よんです。', aPlain: 'ゼロキュウゼロの、イチニサンヨンです。',
    tokens: ['ゼロ・きゅう・ゼロ', 'の', '、', 'いち・に・さん・よん', 'です', '。'],
    distractors: ['はち・きゅう', 'ます', 'は'],
    meaning: { en: 'It is 090-12 34 (spoken digit by digit).', de: '090-12 34 (Ziffer für Ziffer gesprochen).' },
  },
  {
    id: 4,
    q: '[何歳](なんさい)ですか。', qPlain: '何歳ですか。',
    a: '[私](わたし)は[三十五歳](さんじゅうごさい)です。', aPlain: '私は三十五歳です。',
    tokens: ['私は', '三十五歳', 'です', '。'],
    distractors: ['二十五歳', 'ます', '年生'],
    meaning: { en: 'I am 35 years old.', de: 'Ich bin 35 Jahre alt.' },
  },
  {
    id: 5,
    q: '[国籍](こくせき)はどこですか。', qPlain: '国籍はどこですか。',
    a: 'ドイツです。', aPlain: 'ドイツです。',
    tokens: ['ドイツ', 'です', '。'],
    distractors: ['日本', 'ます', 'スイス'],
    meaning: { en: 'Germany.', de: 'Deutschland.' },
  },
  {
    id: 6,
    q: '[日本](にほん)に[来](き)たことありますか。', qPlain: '日本に来たことありますか。',
    a: 'はい、[一度](いちど)[来](き)ました。', aPlain: 'はい、一度来ました。',
    tokens: ['はい', '、', '一度', '来ました', '。'],
    distractors: ['行きました', 'いいえ', '来ます'],
    meaning: { en: 'Yes, I have been here once.', de: 'Ja, ich war schon einmal hier.' },
  },
  {
    id: 7,
    q: '[何回](なんかい)[来](き)ましたか。', qPlain: '何回来ましたか。',
    a: '[二回](にかい)[来](き)ました。', aPlain: '二回来ました。',
    tokens: ['二回', '来ました', '。'],
    distractors: ['五回', '行きました', '来ます'],
    meaning: { en: 'I have come twice.', de: 'Ich war zweimal hier.' },
  },
  {
    id: 8,
    q: '[結婚](けっこん)していますか。', qPlain: '結婚していますか。',
    a: 'いいえ、[独身](どくしん)です。', aPlain: 'いいえ、独身です。',
    tokens: ['いいえ', '、', '独身', 'です', '。'],
    distractors: ['はい', 'しています', 'ます'],
    meaning: { en: 'No, I am single.', de: 'Nein, ich bin ledig.' },
  },
  {
    id: 9,
    q: '[家族](かぞく)は[何人](なんにん)ですか。', qPlain: '家族は何人ですか。',
    a: '[四人](よにん)です。', aPlain: '四人です。',
    tokens: ['四人', 'です', '。'],
    distractors: ['五人', '三', 'ます'],
    meaning: { en: 'We are four people.', de: 'Wir sind vier.' },
  },
  {
    id: 10,
    q: '[会社員](かいしゃいん)ですか、[学生](がくせい)ですか。', qPlain: '会社員ですか、学生ですか。',
    a: 'エンジニアです。', aPlain: 'エンジニアです。',
    tokens: ['エンジニア', 'です', '。'],
    distractors: ['学生', '先生', 'ます'],
    meaning: { en: 'I am an engineer. (Your job)', de: 'Ich bin Ingenieur. (Dein Beruf)' },
  },
  {
    id: 11,
    q: 'どのくらい[日本語](にほんご)を[勉強](べんきょう)しましたか。', qPlain: 'どのくらい日本語を勉強しましたか。',
    a: '[二年](にねん)[勉強](べんきょう)しました。', aPlain: '二年勉強しました。',
    tokens: ['二年', '勉強', 'しました', '。'],
    distractors: ['三月', '学びました', 'します'],
    meaning: { en: 'I studied for about two years.', de: 'Ich habe etwa zwei Jahre gelernt.' },
  },
  {
    id: 12,
    q: '[今](いま)、[日本](にほん)に[家族](かぞく)がいますか。', qPlain: '今、日本に家族がいますか。',
    a: 'いいえ、いません。', aPlain: 'いいえ、いません。',
    tokens: ['いいえ', '、', 'いません', '。'],
    distractors: ['います', 'はい', 'いる'],
    meaning: { en: 'No, they are not here.', de: 'Nein, sie sind nicht hier.' },
  },
  {
    id: 13,
    q: 'どうして[日本語](にほんご)を[勉強](べんきょう)しますか。', qPlain: 'どうして日本語を勉強しますか。',
    a: '[日本](にほん)に[住](す)みたいからです。', aPlain: '日本に住みたいからです。',
    tokens: ['日本に', '住みたい', 'から', 'です', '。'],
    distractors: ['すむ', 'だから', 'します'],
    meaning: { en: 'Because I want to live in Japan.', de: 'Weil ich in Japan leben möchte.' },
  },
  {
    id: 14,
    q: '[毎朝](まいあさ)、[何時](なんじ)に[起](お)きますか。', qPlain: '毎朝、何時に起きますか。',
    a: '[毎朝](まいあさ)[七時](しちじ)に[起](お)きます。', aPlain: '毎朝七時に起きます。',
    tokens: ['毎朝', '七時に', '起きます', '。'],
    distractors: ['六時に', 'おき', 'で'],
    meaning: { en: 'I get up at seven every morning.', de: 'Ich stehe jeden Morgen um sieben auf.' },
  },
  {
    id: 15,
    q: '[明日](あした)は[何曜日](なんようび)ですか。', qPlain: '明日は何曜日ですか。',
    a: '[明日](あした)は[木曜日](もくようび)です。', aPlain: '明日は木曜日です。',
    tokens: ['明日は', '木曜日', 'です', '。'],
    distractors: ['火曜日', '水曜日', 'ます'],
    meaning: { en: 'Tomorrow is Thursday.', de: 'Morgen ist Donnerstag.' },
  },
  {
    id: 16,
    q: '[昨日](きのう)の[夜](よる)は[何](なに)を[食](た)べましたか。', qPlain: '昨日の夜は何を食べましたか。',
    a: 'カレーを[食](た)べました。', aPlain: 'カレーを食べました。',
    tokens: ['カレーを', '食べました', '。'],
    distractors: ['ラーメン', '寿司', '飲みました'],
    meaning: { en: 'I ate curry.', de: 'Ich habe Curry gegessen.' },
  },
  {
    id: 17,
    q: 'いちばん[好](す)きな[飲](の)み[物](もの)は[何](なん)ですか。', qPlain: '一番好きな飲み物は何ですか。',
    a: 'お[茶](ちゃ)がいちばん[好](す)きです。', aPlain: 'お茶が一番好きです。',
    tokens: ['お茶が', 'いちばん', '好き', 'です', '。'],
    distractors: ['コーヒー', 'ビール', 'ます'],
    meaning: { en: 'I like tea the most.', de: 'Ich mag Tee am liebsten.' },
  },
  {
    id: 18,
    q: 'どんなスポーツが[好](す)きですか。', qPlain: 'どんなスポーツが好きですか。',
    a: 'サッカーが[好](す)きです。', aPlain: 'サッカーが好きです。',
    tokens: ['サッカーが', '好き', 'です', '。'],
    distractors: ['テニス', '野球', 'ます'],
    meaning: { en: 'I like football.', de: 'Ich mag Fußball.' },
  },
  {
    id: 19,
    q: 'それが[上手](じょうず)ですか。', qPlain: 'それが上手ですか。',
    a: 'いいえ、あまり[上手](じょうず)ではありません。', aPlain: 'いいえ、あまり上手ではありません。',
    tokens: ['いいえ', '、', 'あまり', '上手', 'ではありません', '。'],
    distractors: ['とても', 'はい', 'です'],
    meaning: { en: 'No, I am not very good at it.', de: 'Nein, nicht besonders gut.' },
  },
  {
    id: 20,
    q: 'たばこを[吸](す)いますか。', qPlain: 'たばこを吸いますか。',
    a: 'いいえ、[吸](す)いません。', aPlain: 'いいえ、吸いません。',
    tokens: ['いいえ', '、', '吸いません', '。'],
    distractors: ['吸います', 'はい', 'ます'],
    meaning: { en: 'No, I do not smoke.', de: 'Nein, ich rauche nicht.' },
  },
  {
    id: 21,
    q: '[趣味](しゅみ)は[何](なん)ですか。', qPlain: '趣味は何ですか。',
    a: '[読書](どくしょ)です。', aPlain: '読書です。',
    tokens: ['読書', 'です', '。'],
    distractors: ['音楽', '料理', 'ます'],
    meaning: { en: 'Reading.', de: 'Lesen.' },
  },
  {
    id: 22,
    q: 'あなたの[国](くに)は[今](いま)、[暑](あつ)いですか、[寒](さむ)いですか。', qPlain: 'あなたの国は今、暑いですか、寒いですか。',
    a: '[今](いま)は[寒](さむ)いです。', aPlain: '今は寒いです。',
    tokens: ['今は', '寒い', 'です', '。'],
    distractors: ['暑い', '寒く', 'ます'],
    meaning: { en: 'It is cold right now.', de: 'Es ist gerade kalt.' },
  },
  {
    id: 23,
    q: 'あなたの[国](くに)で[何](なに)が[有名](ゆうめい)ですか。', qPlain: 'あなたの国で何が有名ですか。',
    a: 'ビールが[有名](ゆうめい)です。', aPlain: 'ビールが有名です。',
    tokens: ['ビールが', '有名', 'です', '。'],
    distractors: ['お城', 'ワイン', 'ます'],
    meaning: { en: 'Beer is famous there.', de: 'Bier ist dort berühmt.' },
  },
  {
    id: 24,
    q: '[日本](にほん)[料理](りょうり)を[食](た)べたことがありますか。', qPlain: '日本料理を食べたことがありますか。',
    a: 'はい、あります。', aPlain: 'はい、あります。',
    tokens: ['はい', '、', 'あります', '。'],
    distractors: ['いいえ', 'ありません', '食べる'],
    meaning: { en: 'Yes, I have.', de: 'Ja, habe ich.' },
  },
  {
    id: 25,
    q: 'どうでしたか。', qPlain: 'どうでしたか。',
    a: 'とてもおいしかったです。', aPlain: 'とてもおいしかったです。',
    tokens: ['とても', 'おいしかった', 'です', '。'],
    distractors: ['おいしい', 'まずい', 'ます'],
    meaning: { en: 'It was very delicious.', de: 'Es war sehr lecker.' },
  },
];
