import type { JLPTLevel, LevelData } from './types';
import { n5Data } from './n5';

// n5 eager (default level, LCP path); n4/n3 load as separate idle chunks
export const levelData: Record<JLPTLevel, LevelData> = {
  N5: n5Data,
  N4: {} as LevelData,
  N3: {} as LevelData,
};

let hydrated = false;
export async function hydrateLevelData(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  const [{ n4Data }, { n3Data }] = await Promise.all([
    import('./n4'),
    import('./n3'),
  ]);
  levelData.N4 = n4Data;
  levelData.N3 = n3Data;
}

export const allLevels: JLPTLevel[] = ['N5', 'N4', 'N3'];

export type { JLPTLevel, LevelData, Question, KanjiEntry, Lang, GameState, TestMode, DeviceMode } from './types';
