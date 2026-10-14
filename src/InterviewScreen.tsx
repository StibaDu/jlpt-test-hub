// Interview Trainer — listening & repeat:
//   1) voice A (面接官) reads the interview question
//   2) voice B reads the model answer
//   3) user rebuilds the answer from a shuffled word bank
// Content: src/data/interview.ts (Meko interview record, 25 questions).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { INTERVIEW_ITEMS, INTERVIEW_FREE_LIMIT } from './data/interview';
import type { InterviewItem } from './data/interview';
import { interviewVoices, speakWith, stopSpeaking } from './tts';
import type { Lang } from './data/types';

/** Local furigana renderer ([漢字](かんじ) → ruby) — avoids importing App internals. */
const renderFurigana = (text: string): React.ReactNode[] => {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<ruby key={i++}>{m[1]}<rt>{m[2]}</rt></ruby>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const T = {
  en: {
    title: 'Interview Trainer',
    interviewer: 'Interviewer',
    you: 'You',
    replay: 'Replay',
    showText: 'Show text',
    hideText: 'Hide text',
    puzzleHint: 'Build the answer — tap the tiles in the right order.',
    mistakes: 'mistakes',
    correct: 'Correct!',
    nextQ: 'Next question',
    finish: 'See results',
    done: 'Interview complete',
    firstTry: 'answered on first try',
    keepPracticing: 'Keep practicing — repetition makes interviews feel easy.',
    doneCta: 'Run it again',
    backHome: 'Back to start',
    lockedTitle: 'All 25 questions with Pro',
    lockedDesc: 'You completed the free preview (5 questions). Pro unlocks the full Meko interview set with harder word-bank distractors.',
    lockedCta: 'Upgrade to Pro',
    ttsHint: 'Tip: use headphones — you hear the question, then the model answer. Then rebuild it below.',
  },
  de: {
    title: 'Interview-Trainer',
    interviewer: 'Interviewer',
    you: 'Du',
    replay: 'Nochmal hören',
    showText: 'Text anzeigen',
    hideText: 'Text verbergen',
    puzzleHint: 'Baue die Antwort — tippe die Kacheln in der richtigen Reihenfolge.',
    mistakes: 'Fehler',
    correct: 'Richtig!',
    nextQ: 'Nächste Frage',
    finish: 'Auswertung ansehen',
    done: 'Interview geschafft',
    firstTry: 'auf Anhieb richtig',
    keepPracticing: 'Weiter üben — Wiederholung macht Interviews leicht.',
    doneCta: 'Nochmal üben',
    backHome: 'Zurück zum Start',
    lockedTitle: 'Alle 25 Fragen mit Pro',
    lockedDesc: 'Du hast die kostenlose Vorschau (5 Fragen) geschafft. Pro schaltet das komplette Meko-Interview-Set mit schwierigeren Ablenkern frei.',
    lockedCta: 'Auf Pro upgraden',
    ttsHint: 'Tipp: Kopfhörer nutzen — erst die Frage hören, dann die Musterantwort. Danach unten nachbauen.',
  },
};

export const InterviewScreen = ({ lang, isPro, onExit, onUpgrade }: {
  lang: Lang;
  isPro: boolean;
  onExit: () => void;
  onUpgrade: () => void;
}) => {
  const tr = T[lang];
  const maxItems = isPro ? INTERVIEW_ITEMS.length : INTERVIEW_FREE_LIMIT;
  const items = INTERVIEW_ITEMS.slice(0, maxItems);

  const [idx, setIdx] = useState(0);
  const [revealQ, setRevealQ] = useState(false);
  const [revealA, setRevealA] = useState(false);
  const [built, setBuilt] = useState<string[]>([]);
  const [bank, setBank] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [playing, setPlaying] = useState<'q' | 'a' | null>(null);
  const [phase, setPhase] = useState<'run' | 'locked' | 'done'>('run');
  const voices = useMemo(() => interviewVoices(), []);
  const voicesRef = useRef(voices);
  voicesRef.current = voices;

  const item: InterviewItem = items[idx];

  const resetItem = () => {
    stopSpeaking();
    setBuilt([]);
    setBank(shuffle([...items[idx].tokens, ...items[idx].distractors]));
    setSolved(false);
    setMistakes(0);
    setRevealQ(false);
    setRevealA(false);
  };

  // play: question (voice A) → optionally chained model answer (voice B)
  const playQA = (qFirst: boolean, chain = false) => {
    const v = voicesRef.current;
    const qRate = 0.92, aRate = 0.92;
    setPlaying(qFirst ? 'q' : 'a');
    speakWith(qFirst ? item.qPlain : item.aPlain, {
      rate: qFirst ? qRate : aRate,
      voiceURI: qFirst ? v.askerURI ?? undefined : v.answererURI ?? undefined,
      pitch: qFirst ? 1.0 : v.answererPitch,
      onEnd: () => {
        if (qFirst && chain) {
          // small beat between interviewer and answerer (natural conversation pause)
          setTimeout(() => playQA(false), 350);
        } else {
          setPlaying(null);
        }
      },
    });
  };

  useEffect(() => { resetItem(); }, [idx]);
  // auto play Q → A when an item starts (interview rhythm)
  useEffect(() => {
    const t = setTimeout(() => playQA(true, true), 600);
    return () => { clearTimeout(t); stopSpeaking(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // puzzle check
  useEffect(() => {
    if (solved) return;
    if (built.length === item.tokens.length) {
      const ok = built.join('') === item.tokens.join('');
      if (ok) {
        setSolved(true);
        setRevealA(true);
        if (mistakes === 0) setFirstTryCount((c) => c + 1);
        playQA(false); // hear the model answer once more
      } else {
        setMistakes((m) => m + 1);
        setTotalMistakes((m) => m + 1);
        // bounce everything back to the bank after a beat — full retry
        setTimeout(() => {
          setBank((b) => shuffle([...b, ...built]));
          setBuilt([]);
        }, 450);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, solved]);

  const addTile = (tile: string, i: number) => {
    if (solved) return;
    setBank((b) => b.filter((_, j) => j !== i));
    setBuilt((x) => [...x, tile]);
  };
  const removeTile = (i: number) => {
    if (solved) return;
    const tile = built[i];
    setBuilt((x) => x.filter((_, j) => j !== i));
    setBank((b) => [...b, tile]);
  };

  const goNext = () => {
    stopSpeaking();
    // free tier: preview ends with an upsell instead of the results screen
    if (!isPro && idx + 1 >= INTERVIEW_FREE_LIMIT) {
      setPhase('locked');
      return;
    }
    if (idx + 1 >= items.length) {
      setPhase('done');
      return;
    }
    setIdx(idx + 1);
  };

  // ---------- done ----------
  if (phase === 'done') {
    return (
      <div className="min-h-screen bg-ink text-stone-200 py-10 px-4">
        <div className="max-w-lg mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center font-jp font-bold text-2xl text-matcha hanko animate-stamp">完了</div>
          <h1 className="text-3xl font-display font-semibold text-white mt-6">{tr.done}</h1>
          <p className="text-stone-400 mt-3">
            {firstTryCount}/{items.length} {tr.firstTry} · {totalMistakes} {tr.mistakes}
          </p>
          <p className="text-sm text-stone-400 mt-2">{tr.keepPracticing}</p>
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => { setIdx(0); setPhase('run'); setTotalMistakes(0); setFirstTryCount(0); }}
              className="w-full bg-verm hover:bg-ink text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95">
              {tr.doneCta}
            </button>
            <button onClick={onExit}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95">
              {tr.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- locked (free tier beyond preview) ----------
  if (phase === 'locked') {
    return (
      <div className="min-h-screen bg-ink text-stone-200 py-10 px-4">
        <div className="max-w-lg mx-auto text-center animate-in fade-in duration-300">
          <div className="text-5xl mb-4">🎤</div>
          <h1 className="text-2xl font-display font-semibold text-white">{tr.lockedTitle}</h1>
          <p className="text-stone-400 mt-3 text-sm leading-relaxed">{tr.lockedDesc}</p>
          <button onClick={onUpgrade}
            className="mt-6 w-full bg-verm hover:bg-vermDeep text-white font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95">
            {tr.lockedCta}
          </button>
          <button onClick={onExit} className="mt-3 w-full text-stone-400 hover:text-stone-200 text-sm py-2">{tr.backHome}</button>
        </div>
      </div>
    );
  }

  // ---------- run ----------
  return (
    <div className="min-h-screen bg-ink text-stone-200 py-4 px-4">
      <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { stopSpeaking(); onExit(); }}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors">
            ← {tr.backHome}
          </button>
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">{tr.title}</span>
          <span className="text-xs text-stone-400 tabular-nums">{idx + 1}/{items.length}</span>
        </div>
        <div className="mb-5 h-1.5 bg-stone-700/60 rounded-full overflow-hidden">
          <div className="h-full bg-verm rounded-full transition-all duration-500" style={{ width: `${((idx) / items.length) * 100}%` }} />
        </div>

        <p className="text-xs text-stone-500 mb-4 leading-relaxed">{tr.ttsHint}</p>

        {/* interviewer card */}
        <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 mb-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">👔 {tr.interviewer}</span>
            <div className="flex gap-2">
              <button onClick={() => setRevealQ((v) => !v)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-700 hover:bg-stone-600 transition-colors">
                {revealQ ? tr.hideText : tr.showText}
              </button>
              <button
                onClick={() => playQA(true)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${playing === 'q' ? 'bg-verm text-white' : 'bg-verm/80 hover:bg-verm text-white'}`}>
                🔊 {tr.replay}
              </button>
            </div>
          </div>
          {revealQ
            ? <p className="mt-3 text-lg text-white font-jp leading-relaxed">{renderFurigana(item.q)}</p>
            : <p className="mt-3 text-lg text-stone-500 font-jp tracking-widest select-none">・・・</p>}
        </div>

        {/* answer card */}
        <div className="bg-matcha/10 border border-matcha/30 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-matcha">🗣 {tr.you}</span>
            <div className="flex gap-2">
              {(solved || revealA) && (
                <button onClick={() => setRevealA((v) => !v)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-700 hover:bg-stone-600 transition-colors">
                  {revealA ? tr.hideText : tr.showText}
                </button>
              )}
              <button
                onClick={() => playQA(false)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full transition-colors ${playing === 'a' ? 'bg-matcha text-white' : 'bg-matcha/80 hover:bg-matcha text-white'}`}>
                🔊 {tr.replay}
              </button>
            </div>
          </div>
          {revealA
            ? (
              <>
                <p className="mt-3 text-lg text-white font-jp leading-relaxed">{renderFurigana(item.a)}</p>
                <p className="mt-1.5 text-xs text-stone-400">{item.meaning[lang]}</p>
              </>
            )
            : <p className="mt-3 text-lg text-stone-500 font-jp tracking-widest select-none">・・・</p>}
        </div>

        {/* puzzle: built sentence */}
        <p className="text-xs text-stone-400 mb-2">{tr.puzzleHint}</p>
        <div className={`min-h-[84px] rounded-2xl border-2 border-dashed p-3 flex flex-wrap gap-2 content-start transition-colors ${
          solved ? 'border-matcha bg-matcha/10' : built.length > 0 ? 'border-verm/60 bg-verm/5' : 'border-stone-600 bg-stone-800/40'
        }`}>
          {built.length === 0 && <span className="text-stone-600 text-sm select-none">…</span>}
          {built.map((tile, i) => (
            <button key={`${tile}-${i}`} onClick={() => removeTile(i)}
              className="px-3 py-2 rounded-xl bg-card text-ink font-jp font-bold text-base shadow-sm hover:bg-vermSoft transition-colors active:scale-95">
              {tile}
            </button>
          ))}
        </div>

        {/* puzzle: bank */}
        <div className="mt-3 flex flex-wrap gap-2">
          {bank.map((tile, i) => (
            <button key={`${tile}-${i}`} onClick={() => addTile(tile, i)} disabled={solved}
              className="px-3 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-100 font-jp font-bold text-base transition-colors active:scale-95 disabled:opacity-40">
              {tile}
            </button>
          ))}
        </div>

        {/* feedback / next */}
        <div className="mt-5 flex items-center justify-between">
          <span className={`text-xs font-bold ${mistakes > 0 ? 'text-verm' : 'text-stone-500'}`}>
            {mistakes > 0 ? `${mistakes} ${tr.mistakes}` : ''}
          </span>
          {solved ? (
            <button onClick={goNext}
              className="bg-matcha hover:bg-matcha text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 animate-in fade-in duration-300">
              {idx + 1 >= items.length ? tr.finish : tr.nextQ} →
            </button>
          ) : (
            <span className="text-xs text-stone-500">{idx + 1} / {items.length}</span>
          )}
        </div>
        {solved && (
          <p className="mt-3 text-center text-matcha font-bold animate-in fade-in duration-300">✓ {tr.correct}</p>
        )}
      </div>
    </div>
  );
};
