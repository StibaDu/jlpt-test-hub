import type { JLPTLevel, LevelData } from './types';
import { n5Data } from './n5';
import { n4Data } from './n4';
import { n3Data } from './n3';

export const levelData: Record<JLPTLevel, LevelData> = {
  N5: n5Data,
  N4: n4Data,
  N3: n3Data,
};

export const allLevels: JLPTLevel[] = ['N5', 'N4', 'N3'];

export type { JLPTLevel, LevelData, Question, KanjiEntry, Lang, GameState, TestMode, DeviceMode } from './types';