// Web Speech API TTS helper — free, no server, works offline
// Voice ranking: prefer high-quality neural/natural voices over robotic defaults

/** Known high-quality voice name keywords, ranked best first */
const QUALITY_KEYWORDS = ['natural', 'neural', 'google', 'premium', 'enhanced', 'siri', 'eloquence'];

export const ttsSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Rank available ja-JP voices by quality.
 * Returns the best voice, or null if none exists.
 */
export const getJapaneseVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const jpVoices = voices.filter(v => v.lang.startsWith('ja'));
  if (jpVoices.length === 0) return null;

  // Score each voice: higher = better
  const scored = jpVoices.map(v => {
    const name = (v.name || '').toLowerCase();
    let score = 0;
    QUALITY_KEYWORDS.forEach((kw, i) => {
      if (name.includes(kw)) score += 100 - i * 10;
    });
    // Local (pre-installed OS) voices are usually better than remote
    if (v.localService) score += 5;
    return { voice: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].voice;
};

/**
 * Check if the best available Japanese voice is likely robotic
 * (i.e., no quality keywords matched). Used to show a hint.
 */
export const hasGoodJapaneseVoice = (): boolean => {
  const voice = getJapaneseVoice();
  if (!voice) return false;
  const name = (voice.name || '').toLowerCase();
  return QUALITY_KEYWORDS.some(kw => name.includes(kw));
};

/** All Japanese voices available on the device (for debugging/settings) */
export const listJapaneseVoices = (): SpeechSynthesisVoice[] => {
  if (!ttsSupported()) return [];
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('ja'));
};

export const speak = (text: string, rate: number = 1.0): void => {
  if (!ttsSupported()) return;
  stopSpeaking();
  const clean = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  const utterance = new SpeechSynthesisUtterance(clean);
  const voice = getJapaneseVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = 'ja-JP';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
};

export const getSavedRate = (): number => {
  try {
    const saved = parseFloat(localStorage.getItem('jlpt-tts-rate') || '1.0');
    return saved >= 0.5 && saved <= 1.0 ? saved : 1.0;
  } catch {
    return 1.0;
  }
};

export const saveRate = (rate: number): void => {
  try { localStorage.setItem('jlpt-tts-rate', String(rate)); } catch {}
};