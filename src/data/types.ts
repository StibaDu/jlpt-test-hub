export type Lang = 'en' | 'de';
export type GameState = 'intro' | 'testing' | 'results' | 'profile' | 'flashcards';
export type TestMode = 'real' | 'learning';
export type DeviceMode = 'desktop' | 'mobile' | null;
export type JLPTLevel = 'N5' | 'N4' | 'N3';

export interface KanjiEntry {
  meaning: Record<Lang, string>;
  desc: Record<Lang, string>;
  onyomi?: string;   // Sino-Japanese reading, katakana (e.g. 'コウ')
  kunyomi?: string;  // Native Japanese reading, hiragana (e.g. 'つぎ')
  jlpt?: JLPTLevel;  // Level where this entry is introduced
}

export type QuestionCategory =
  | 'Partikel'
  | 'Verb & Konjugation'
  | 'Kanji & Lesung'
  | 'Vokabeln'
  | 'Adjektive'
  | 'Satzbau & Struktur'
  | 'Höflichkeit & Ausdruck';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: Record<Lang, string>;
  category: QuestionCategory;
}

export interface LevelData {
  level: JLPTLevel;
  questionsPerTest: number;
  timeMinutes: number;
  passThreshold: number;
  kanjiDictionary: Record<string, KanjiEntry>;
  questionBank: Question[];
  instruction: string;
  uiStrings: {
    title: string;
    subtitle: string;
    guidelineDoc: string;
    basedOn: string;
  };
}