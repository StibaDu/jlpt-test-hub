import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconCheck, IconX, IconClock } from '../components/Icons';
import { levelData } from '../data';
import type { Question, JLPTLevel, TestMode } from '../data';

export const TestPage: React.FC = () => {
  const { level, mode } = useParams<{ level: JLPTLevel; mode: TestMode }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentData = levelData[level as JLPTLevel] || levelData.N5;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [learningAnswerRevealed, setLearningAnswerRevealed] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

  const isMobile = window.innerWidth < 768;
  const maxQuestions = 30;

  // Load questions
  useEffect(() => {
    const selectedQuestions = [...currentData.questionBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, 30);
    setQuestions(selectedQuestions);

    if (mode === 'real') {
      setTimeRemaining(60 * 60); // 60 minutes
    }
  }, [level, mode]);

  // Timer
  useEffect(() => {
    if (mode !== 'real' || testSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, testSubmitted]);

  const handleSelectOption = useCallback((optionIndex: number) => {
    if (mode === 'learning' && learningAnswerRevealed) return;
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    if (mode === 'learning') {
      setLearningAnswerRevealed(true);
    }
  }, [mode, learningAnswerRevealed, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < maxQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setLearningAnswerRevealed(false);
    }
  }, [currentQuestionIndex]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setLearningAnswerRevealed(false);
    }
  }, [currentQuestionIndex]);

  const handleSubmitTest = useCallback(async () => {
    setTestSubmitted(true);

    let score = 0;
    const currentQuestions = questions.slice(0, maxQuestions);
    currentQuestions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });
    const percentage = Math.round((score / maxQuestions) * 100);

    setResults({
      score: percentage,
      correct: score,
      total: maxQuestions,
      passed: percentage >= 60,
    });

    // Save to history if logged in
    // await fetch('/api/tests/submit', { ... });
  }, [answers, questions, maxQuestions]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderFurigana = (text: string, onClick?: (kanji: string, furigana: string) => void) => {
    if (!text) return null;
    const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i += 3) {
      if (parts[i]) {
        result.push(<React.Fragment key={`text-${i}`}>{parts[i]}</React.Fragment>);
      }
      if (i + 1 < parts.length) {
        const kanji = parts[i + 1];
        const furigana = parts[i + 2];
        result.push(
          <span
            key={`ruby-${i}`}
            onClick={(e) => {
              if (onClick) {
                e.preventDefault();
                e.stopPropagation();
                onClick(kanji, furigana);
              }
            }}
            className={`inline-block align-bottom ${onClick ? 'cursor-pointer hover:bg-emerald-100 rounded px-0.5 transition-colors' : ''}`}
            title={onClick ? "Click for meaning" : ""}
          >
            <ruby>
              {kanji}
              <rt className="text-[0.6em] text-emerald-700 font-normal select-none leading-none">{furigana}</rt>
            </ruby>
          </span>
        );
      }
    }
    return result;
  };

  if (!level || !mode) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnsweredCurrent = answers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === maxQuestions - 1;

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">Loading questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-blue-500">
              {mode === 'learning' ? 'Learning Mode' : 'Real Test'}
            </span>
            <div className="bg-gray-100 text-gray-800 font-bold rounded-md flex items-center {isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1'}">
              {currentQuestionIndex + 1} <span className="text-gray-400 font-normal ml-1">/ {maxQuestions}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === 'real' && (
              <div className={`flex items-center gap-1.5 font-mono font-bold rounded-lg border px-2 py-1.5 ${timeRemaining < 300 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                <IconClock className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                {formatTime(timeRemaining)}
              </div>
            )}
            <div className="flex items-center gap-1.5 font-mono text-xs md:text-sm rounded-lg border px-3 py-1.5 bg-gray-100 text-gray-800 font-bold">
              {mode === 'learning' ? '📖 Learning' : '⏱️ Real Test'}
            </div>
          </div>
        </div>

        <div className="h-1 bg-gray-100 w-full">
          <div
            className={`h-full transition-all duration-300 ${mode === 'learning' ? 'bg-blue-500' : 'bg-emerald-500'}`}
            style={{ width: `${((currentQuestionIndex + 1) / maxQuestions) * 100}%` }}
          ></div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <article className="bg-white shadow-sm border border-gray-200 rounded-xl md:rounded-2xl mb-6 md:mb-8 p-4 md:p-6 md:p-8">
          <div className="text-gray-500 border-b border-gray-100 pb-3 md:pb-4 mb-4 md:mb-6 flex justify-between items-end">
            <span>{renderFurigana('[次](つぎ)の[文](ぶん)の(　　)に1・2・3・4の[中](なか)から[最](もっと)も[適当](てきとう)な[言葉](ことば)を[入](い)れてください。')}</span>
            {mode === 'learning' && <span className="text-blue-400 italic shrink-0 ml-2 text-xs md:text-sm">Click kanji for reading/meaning</span>}
          </div>

          <h2 className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium md:pb-2 pb-1 {isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}">
            {renderFurigana(currentQuestion.text)}
          </h2>

          <div className="mt-6 md:mt-10 grid gap-3 {isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:mt-10 md:gap-4'}">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestionIndex] === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;
              const showFeedback = mode === 'learning' && learningAnswerRevealed;

              let buttonStyle = "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700 cursor-pointer";
              let badgeStyle = "border-gray-300 text-gray-400";

              if (showFeedback) {
                buttonStyle = "border-gray-200 opacity-60 cursor-default";
                if (isCorrectOption) {
                  buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500 ring-offset-1 cursor-default";
                  badgeStyle = "border-emerald-500 bg-emerald-500 text-white";
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = "border-red-400 bg-red-50 text-red-900 cursor-default";
                  badgeStyle = "border-red-400 bg-red-400 text-white";
                }
              } else if (isSelected) {
                buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm cursor-pointer";
                badgeStyle = "border-emerald-500 bg-emerald-500 text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showFeedback}
                  className={`relative rounded-xl border-2 text-left transition-all duration-200 ${isMobile ? 'p-4 text-base' : 'p-5 md:p-6 text-lg'} ${buttonStyle}`}
                >
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center rounded-full border-2 mr-3 md:mr-4 font-bold shrink-0 transition-colors ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm md:w-10 md:h-10 md:text-base'} ${badgeStyle}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed block break-words w-full {isMobile ? 'text-lg' : 'text-xl'}">
                      {renderFurigana(option)}
                    </span>

                    {showFeedback && isCorrectOption && <IconCheck className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-600 ml-auto shrink-0`} />}
                    {showFeedback && isSelected && !isCorrectOption && <IconX className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-red-600 ml-auto shrink-0`} />}
                  </div>
                </button>
              );
            })}
          </div>
        </article>

        <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-10 md:py-4 md:px-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="rounded-lg font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors px-4 md:px-6 py-2 md:py-3"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitTest}
                disabled={mode === 'learning' && !learningAnswerRevealed}
                className="rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-5 md:px-8 py-2 md:py-3"
              >
                Finish Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={(mode === 'real' && !hasAnsweredCurrent) || (mode === 'learning' && !learningAnswerRevealed)}
                className={`rounded-lg font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-5 md:px-8 py-2 md:py-3 ${mode === 'learning' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                Next
              </button>
            )}
          </div>
        </footer>

        {/* Results Modal */}
        {testSubmitted && results && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                {results.passed ? (
                  <>
                    <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-500 mx-auto mb-4 w-16 h-16">
                      <IconCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Test Passed!</h2>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto mb-4 w-16 h-16">
                      <IconX className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Test Failed</h2>
                  </>
                )}
                <p className="text-gray-500 mb-2">{results.correct} / {results.total} correct</p>
                <p className="text-3xl font-black {results.passed ? 'text-emerald-600' : 'text-red-600'} mb-6">{results.score}%</p>
                <p className="text-gray-500 text-sm mb-6">Pass requirement: 60%</p>
              </div>

              <div className="space-y-4">
                {user ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 py-3 px-6"
                  >
                    Back to Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 py-3 px-6"
                  >
                    Sign up to save your progress →
                  </button>
                )}
                <button
                  onClick={() => navigate(`/test/${level}/${mode}`)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl shadow-md transition-all active:scale-95 py-3 px-6"
                >
                  Retry Test
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}