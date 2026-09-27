// Web Speech API TTS helper — free, no server, works offline

export const ttsSupported = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

const getJapaneseVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith('ja')) || null;
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