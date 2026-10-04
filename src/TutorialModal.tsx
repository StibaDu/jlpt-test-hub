// Onboarding tutorial — 4-slide welcome tour, first visit only + replayable from profile
import { useState, useEffect } from 'react';

export const TUTORIAL_KEY = 'jlpt-tutorial-done';
export const HINTS_ENABLED_KEY = 'jlpt-tutorial-hints-enabled';
export const HINT_REALTEST_KEY = 'jlpt-hint-realtest-shown';
export const HINT_FLASH_KEY = 'jlpt-hint-flash-shown';
export const HINT_WRONG_KEY = 'jlpt-hint-wrong-shown';

export const tutorialSeen = (): boolean => {
  try { return localStorage.getItem(TUTORIAL_KEY) === 'true'; } catch { return false; }
};
export const hintsEnabled = (): boolean => {
  try {
    const v = localStorage.getItem(HINTS_ENABLED_KEY);
    if (v === 'false') return false;
    if (v === 'true') return true;
    localStorage.setItem(HINTS_ENABLED_KEY, 'true');
    return true;
  } catch { return true; }
};
export const markHint = (key: string): void => {
  try { localStorage.setItem(key, 'true'); } catch {}
};
export const hintShown = (key: string): boolean => {
  try { return localStorage.getItem(key) === 'true'; } catch { return false; }
};

// Illustration components (pure CSS/SVG, lightweight)
const SlideArt = {
  modes: (
    <div className="flex gap-3 justify-center items-stretch my-1">
      <div className="flex-1 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 text-center">
        <div className="text-3xl mb-1">⏱</div>
        <div className="text-xs font-black text-emerald-800">REAL</div>
        <div className="text-[10px] text-emerald-700">60 min</div>
      </div>
      <div className="flex-1 bg-blue-50 border-2 border-blue-300 rounded-xl p-3 text-center">
        <div className="text-3xl mb-1">📖</div>
        <div className="text-xs font-black text-blue-800">LEARN</div>
        <div className="text-[10px] text-blue-700">free</div>
      </div>
    </div>
  ),
  card: (
    <div className="my-1" style={{ perspective: 800 }}>
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-18deg)' }} className="mx-auto w-40 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg border-2 border-emerald-300 flex items-center justify-center">
        <span className="text-5xl font-black text-white">大</span>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">✗ Didn't know</span>
        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">✓ Got it</span>
      </div>
    </div>
  ),
  numbers: (
    <div className="space-y-2 my-1 text-left">
      {[
        ['🎯', 'Kanji Focus', 'test coverage'],
        ['🔥', 'Streak', 'days in a row'],
        ['⭐', 'XP', 'correct answers'],
        ['📚', 'Notebook', 'your mistakes'],
      ].map(([icon, label, sub]) => (
        <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-black text-gray-800">{label}</span>
          <span className="text-[10px] text-gray-500 ml-auto">{sub}</span>
        </div>
      ))}
    </div>
  ),
};

export interface TutorialStrings {
  [key: string]: string;
}

export const tutorialStrings = {
  en: {
    skip: 'Skip tour',
    next: 'Next',
    back: 'Back',
    done: 'Start practicing!',
    slideDot: 'Slide',
    s1Title: 'Welcome to JLPT Test Hub',
    s1Text: 'Practice real JLPT questions for N5, N4 and N3 — free, no signup. This 60-second tour shows you everything.',
    s2Title: 'Two ways to practice',
    s2Text: '⏱ Real Test = exam conditions: timed, no dictionary, no feedback until the end. 📖 Learning Mode = instant feedback after every answer, dictionary allowed, and a free trial of the Real Test. Start with Learning Mode!',
    s3Title: 'Flashcards lock knowledge in',
    s3Text: "Flip a card and rate it: 'Didn't know' brings it back tomorrow, 'Got it' spaces it out over days and weeks. The app schedules your reviews — the method Anki uses. (Pro feature)",
    s4Title: 'What the numbers mean',
    s4Text: "🎯 Kanji Focus = % of test kanji you've mastered · 🔥 Streak = days practiced in a row · ⭐ XP = points for correct answers (perfect test = bonus) · 📚 Mistake Notebook = every wrong question saved with explanation. Ready! Pick a level and start.",
  },
  de: {
    skip: 'Tour überspringen',
    next: 'Weiter',
    back: 'Zurück',
    done: 'Los geht\'s! Loslernen!',
    slideDot: 'Folien',
    s1Title: 'Willkommen bei JLPT Test Hub',
    s1Text: 'Übe echte JLPT-Fragen für N5, N4 und N3 — kostenlos, ohne Registrierung. Diese 60-Sekunden-Tour zeigt dir alles.',
    s2Title: 'Zwei Übungsmodi',
    s2Text: '⏱ Real-Test = Prüfungsbedingungen: zeitgesteuert, kein Wörterbuch, keine Feedback bis zum Ende. 📖 Lernmodus = sofortiges Feedback nach jeder Antwort, Wörterbuch erlaubt, 1 Real-Test-Trial gratis. Start mit dem Lernmodus!',
    s3Title: 'Karteikarten sichern Wissen',
    s3Text: 'Karte umdrehen und bewerten: "Nicht gewusst" holt sie morgen zurück, "Gewusst" stretcht den Abstand auf Tage/Wochen. Die App plant deine Wiederholungen — wie Anki. (Pro)',
    s4Title: 'Was die Zahlen bedeuten',
    s4Text: '🎯 Kanji-Fokus = % der Test-Kanji gemeistert · 🔥 Streak = Tage in Folge · ⭐ XP = Punkte für richtige Antworten (perfekt = Bonus) · 📚 Fehlerheft = jede falsche Frage mit Erklärung. Los! Wähle ein Level und starte.',
  },
};

export const TutorialModal = ({ show, onClose, lang }: { show: boolean; onClose: () => void; lang: 'en' | 'de' }) => {
  const [step, setStep] = useState(0);
  const T = tutorialStrings[lang] || tutorialStrings.en;

  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  if (!show) return null;

  const total = 4;

  const finish = () => {
    try { localStorage.setItem(TUTORIAL_KEY, 'true'); } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100 relative" onClick={e => e.stopPropagation()}>
        {/* Skip */}
        <button onClick={finish} className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-700 font-bold">
          {T.skip}
        </button>

        {/* Slide content */}
        <div className="min-h-[280px] flex flex-col justify-center">
          {step === 0 && (
            <>
              <div className="text-5xl text-center mb-4">🇯🇵</div>
              <h3 className="text-2xl font-black text-gray-900 text-center mb-3">{T.s1Title}</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">{T.s1Text}</p>
            </>
          )}
          {step === 1 && (
            <>
              {SlideArt.modes}
              <h3 className="text-xl font-black text-gray-900 text-center mb-3">{T.s2Title}</h3>
              <p className="text-gray-600 text-xs text-center leading-relaxed">{T.s2Text}</p>
            </>
          )}
          {step === 2 && (
            <>
              {SlideArt.card}
              <h3 className="text-xl font-black text-gray-900 text-center mb-3">{T.s3Title}</h3>
              <p className="text-gray-600 text-xs text-center leading-relaxed">{T.s3Text}</p>
            </>
          )}
          {step === 3 && (
            <>
              {SlideArt.numbers}
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">{T.s4Title}</h3>
              <p className="text-gray-600 text-[11px] text-center leading-relaxed">{T.s4Text}</p>
            </>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 my-4">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`${T.slideDot} ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-emerald-600' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors">
              {T.back}
            </button>
          )}
          <button
            onClick={() => (step < total - 1 ? setStep(s => s + 1) : finish())}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            {step < total - 1 ? T.next : T.done}
          </button>
        </div>
      </div>
    </div>
  );
};