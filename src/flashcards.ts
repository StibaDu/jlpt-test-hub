// Flashcard deck generator — builds all deck types from existing levelData
// Card types: kanji (k-), vocab (v-), grammar-pattern (gp-), grammar-cloze (gc-)
import type { JLPTLevel } from './data/types';

export interface Flashcard {
  cardId: string;            // 'k-N5-文' | 'v-N4-怪我' | 'gp-N5-q13' | 'gc-N5-q13'
  kind: 'kanji' | 'vocab' | 'grammar-pattern' | 'grammar-cloze';
  level: JLPTLevel;
  // front
  frontMain: string;         // kanji char | word | pattern 「〜ながら」 | cloze sentence
  frontSub?: string;         // hint/translation for recall direction
  // back
  meaningEn?: string;
  meaningDe?: string;
  onyomi?: string;
  kunyomi?: string;
  descEn?: string;
  descDe?: string;
  // grammar extras
  questionId?: number;       // for grammar cards (source question)
  exampleSentence?: string;  // the original sentence (readings intact)
  correctAnswer?: string;
  wrongOptions?: string[];   // why-they-are-wrong content on back
  explanationEn?: string;
  explanationDe?: string;
}

const FURIGANA_RE = /\[([^\]]+)\]\(([^\)]+)\)/g;

export function stripFurigana(text: string): string {
  return text.replace(/\\n/g, '\n').replace(FURIGANA_RE, '$1');
}

export function kanaOf(text: string): string {
  const m = FURIGANA_RE.exec(text.replace('\\n', ' '));
  FURIGANA_RE.lastIndex = 0;
  return m ? m[2] : '';
}

const GRAMMAR_CATEGORIES = ['Partikel', 'Verb & Konjugation', 'Adjektive', 'Satzbau & Struktur', 'Höflichkeit & Ausdruck'];

// Extract a tested pattern (particle/piece) from a grammar question's correct option.
export function extractPattern(correctOption: string): string {
  return `〜${correctOption}`;
}

const LEVEL_ORDER: JLPTLevel[] = ['N5', 'N4', 'N3'];

// ---- Deck definitions ----
export interface DeckInfo {
  deckId: string;
  titleEn: string;
  titleDe: string;
  descEn: string;
  descDe: string;
  icon: string;
  kind: 'kanji' | 'vocab' | 'grammar-pattern' | 'grammar-cloze' | 'due' | 'mistakes';
  level: JLPTLevel | 'all';
}

export function allDecks(levelsData: Record<JLPTLevel, any>): DeckInfo[] {
  const decks: DeckInfo[] = [];
  for (const lvl of LEVEL_ORDER) {
    const d = levelsData[lvl];
    decks.push({
      deckId: `kanji-${lvl}`,
      titleEn: `Kanji ${lvl}`,
      titleDe: `Kanji ${lvl}`,
      descEn: `${Object.keys(d.kanjiDictionary).length} characters — readings & meanings`,
      descDe: `${Object.keys(d.kanjiDictionary).length} Schriftzeichen — Lesungen & Bedeutungen`,
      icon: '🈶',
      kind: 'kanji',
      level: lvl,
    });
    decks.push({
      deckId: `vocab-${lvl}`,
      titleEn: `Vocabulary ${lvl}`,
      titleDe: `Vokabeln ${lvl}`,
      descEn: 'Words from real test questions — with pronunciation',
      descDe: 'Wörter aus echten Prüfungsfragen — mit Aussprache',
      icon: '💬',
      kind: 'vocab',
      level: lvl,
    });
    decks.push({
      deckId: `grammar-pattern-${lvl}`,
      titleEn: `Grammar Patterns ${lvl}`,
      titleDe: `Grammatische Muster ${lvl}`,
      descEn: 'Particles, forms & structures — what they mean and when to use them',
      descDe: 'Partikel, Formen & Strukturen — Bedeutung und Verwendung',
      icon: '🧩',
      kind: 'grammar-pattern',
      level: lvl,
    });
    decks.push({
      deckId: `grammar-cloze-${lvl}`,
      titleEn: `Grammar Recall ${lvl}`,
      titleDe: `Grammatik abrufen ${lvl}`,
      descEn: 'Cloze sentences — fill in the correct form from memory',
      descDe: 'Lückensätze — die richtige Form aus dem Gedächtnis einsetzen',
      icon: '✏️',
      kind: 'grammar-cloze',
      level: lvl,
    });
  }
  return decks;
}

// ---- Card builders ----
export function buildKanjiCards(levelsData: Record<JLPTLevel, any>, level: JLPTLevel): Flashcard[] {
  return Object.entries(levelsData[level].kanjiDictionary).map(([kanji, entry]: any) => ({
    cardId: `k-${level}-${kanji}`,
    kind: 'kanji' as const,
    level,
    frontMain: kanji,
    meaningEn: entry.meaning?.en,
    meaningDe: entry.meaning?.de,
    onyomi: entry.onyomi,
    kunyomi: entry.kunyomi,
    descEn: entry.desc?.en,
    descDe: entry.desc?.de,
  }));
}

export function buildVocabCards(levelsData: Record<JLPTLevel, any>, level: JLPTLevel): Flashcard[] {
  const cards: Flashcard[] = [];
  const seen = new Set<string>();
  for (const q of levelsData[level].questionBank) {
    for (const match of (q.text.matchAll(FURIGANA_RE) || []) as any[]) {
      const [, word] = match;
      if (word.length < 2 || seen.has(word)) continue;
      seen.add(word);
      cards.push({
        cardId: `v-${level}-${word}`,
        kind: 'vocab',
        level,
        frontMain: word,
        frontSub: stripFurigana(q.text).slice(0, 60),
        exampleSentence: stripFurigana(q.text),
      });
    }
  }
  return cards;
}

export function buildGrammarCards(levelsData: Record<JLPTLevel, any>, level: JLPTLevel): { pattern: Flashcard[]; cloze: Flashcard[] } {
  const pattern: Flashcard[] = [];
  const cloze: Flashcard[] = [];
  for (const q of levelsData[level].questionBank) {
    if (!GRAMMAR_CATEGORIES.includes(q.category)) continue;
    const correct = q.options[q.correctIndex];
    const correctPlain = stripFurigana(correct);
    const wrongs = q.options.filter((_: string, i: number) => i !== q.correctIndex).map(stripFurigana);
    const pat = extractPattern(correctPlain);
    pattern.push({
      cardId: `gp-${level}-q${q.id}`,
      kind: 'grammar-pattern',
      level,
      frontMain: pat,
      questionId: q.id,
      exampleSentence: stripFurigana(q.text),
      correctAnswer: correctPlain,
      explanationEn: q.explanation?.en,
      explanationDe: q.explanation?.de,
    });
    cloze.push({
      cardId: `gc-${level}-q${q.id}`,
      kind: 'grammar-cloze',
      level,
      frontMain: stripFurigana(q.text),
      questionId: q.id,
      correctAnswer: correctPlain,
      wrongOptions: wrongs,
      explanationEn: q.explanation?.en,
      explanationDe: q.explanation?.de,
    });
  }
  return { pattern, cloze };
}

// ---- Build any deck by id ----
export function buildDeck(deckId: string, levelsData: Record<JLPTLevel, any>): Flashcard[] {
  const [, kind, lvl] = deckId.match(/^([a-z-]+)-((?:N[345])|all)$/) || [];
  if (!kind || !lvl) return [];
  switch (kind) {
    case 'kanji': return buildKanjiCards(levelsData, lvl as JLPTLevel);
    case 'vocab': return buildVocabCards(levelsData, lvl as JLPTLevel);
    case 'grammar-pattern': return buildGrammarCards(levelsData, lvl as JLPTLevel).pattern;
    case 'grammar-cloze': return buildGrammarCards(levelsData, lvl as JLPTLevel).cloze;
    default: return [];
  }
}

// ---- Weakness decks (Mode A) — built in App from weaknessData + notebook ----
export function buildWeakGrammarDeck(levelsData: Record<JLPTLevel, any>, weakQuestionIds: number[], level: JLPTLevel): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const q of levelsData[level].questionBank) {
    if (!GRAMMAR_CATEGORIES.includes(q.category)) continue;
    if (!weakQuestionIds.includes(q.id)) continue;
    const correct = stripFurigana(q.options[q.correctIndex]);
    cards.push({
      cardId: `gc-${level}-q${q.id}`,
      kind: 'grammar-cloze',
      level,
      frontMain: stripFurigana(q.text),
      questionId: q.id,
      correctAnswer: correct,
      explanationEn: q.explanation?.en,
      explanationDe: q.explanation?.de,
    });
  }
  return cards;
}

export const DECK_SIZE_LIMIT = 30;

// TTS helper for cards (uses V1 tts module)
import { speak } from './tts';

function firstKana(reading?: string): string {
  if (!reading) return '';
  return reading.split(',')[0].replace(/[^ぁ-ゖー]+/g, '');
}

export function speakForCard(card: Flashcard, face: 'front' | 'back' = 'front'): void {
  if (card.kind === 'kanji') {
    const k = firstKana(card.kunyomi);
    speak(face === 'front' && k ? k : firstKana(card.onyomi) || stripFurigana(card.frontMain));
    return;
  }
  if (card.kind === 'vocab') {
    speak(stripFurigana(card.frontMain));
    return;
  }
  if (card.exampleSentence) speak(card.exampleSentence);
}
