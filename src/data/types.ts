export type Lang = 'en' | 'de';
export type GameState = 'intro' | 'testing' | 'results';
export type TestMode = 'real' | 'learning';
export type DeviceMode = 'desktop' | 'mobile' | null;
export type JLPTLevel = 'N5' | 'N4' | 'N3';

export interface KanjiEntry {
  meaning: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: Record<Lang, string>;
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