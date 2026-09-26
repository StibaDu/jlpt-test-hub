import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { levelData, allLevels } from './data';
import type { JLPTLevel, LevelData, Lang, GameState, TestMode, KanjiEntry, Question } from './data';

interface UiStrings {
  [key: string]: any;
}

const uiTranslations: UiStrings = {
  en: {
    chooseExp: "Choose Your Experience",
    chooseDesc: "Select how you want to simulate the JLPT App.",
    desktopMode: "Desktop Mode",
    desktopDesc: "Responsive full-screen layout",
    mobileMode: "Mobile Simulator",
    mobileDesc: "Interactive smartphone frame",
    selectLevel: "Select JLPT Level",
    selectLevelDesc: "Choose the level you want to practice.",
    title: "JLPT Test Hub — Free N5, N4, N3 Practice Tests & Simulator",
    subtitle: "THE #1 BEST JLPT TEST SIMULATOR & PREPARATION GUIDE",
    basedOn: "Based on official",
    selectMode: "Please select a mode below to begin.",
    strict: "STRICT",
    guided: "GUIDED",
    realTestTitle: "Real Simulated Test",
    realTestDesc: (q: number, m: number) => `Simulates the exact official assessment format. ${q} random questions with a ${m}-minute time limit. No immediate feedback.`,
    startReal: "Start Real Test",
    learningTitle: "Learning Practice Mode",
    learningDesc: "Untimed practice. Receive immediate explanations when you select an answer to learn why an option is correct or incorrect.",
    startLearning: "Start Learning Mode",
    passReq: "Pass requirement: 60% (Applies to both modes)",
    learn: "Learn",
    learningMode: "Learning Mode",
    question: "Question",
    untimed: "Untimed",
    untimedPractice: "Untimed Practice",
    clickKanji: "Click Kanji",
    correct: "Correct!",
    incorrect: "Incorrect. The correct answer was option",
    explanation: "Explanation",
    noExp: "Explanation not available for this question.",
    prev: "Previous",
    next: "Next",
    finish: "Finish",
    testPassed: "Test Passed!",
    testFailed: "Test Failed",
    mode: "Mode",
    practice: "Practice",
    real: "Real",
    requirement: "Requirement",
    yourScore: "Your Score",
    percentage: "Percentage",
    backToStart: "Back to Start Menu",
    detailedReview: "Detailed Review",
    unanswered: "You did not answer this question.",
    meaning: "Meaning",
    context: "Context",
    unknown: "Unknown / Not in dictionary",
    instruction: "Choose the best answer for the blank (　　) from options 1・2・3・4.",
    home: "Home",
    restart: "Restart",
    supportUs: "Support Project",
    supportModalTitle: "Support Free JLPT Prep",
    supportModalDesc: "This project is 100% free with no paywalls or subscriptions. If this tool helped you prepare for your JLPT exam, consider supporting server upkeep or buying us a coffee!",
    coffeeBtn: "☕ Buy a Coffee ($5)",
    close: "Close",
    correctLabel: "Correct",
    incorrectLabel: "Incorrect",
    level: "Level",
    // Affiliate & monetization strings
    recommendedBooks: "Recommended JLPT Books",
    booksDesc: "Official practice workbooks and study guides trusted by JLPT examinees worldwide.",
    bookOfficialWorkbook: "JLPT Official Practice Workbook",
    bookOfficialDesc: "The definitive official guide with real past exam questions for all levels.",
    bookKanjiDict: "Kodansha Kanji Dictionary",
    bookKanjiDesc: "Comprehensive kanji reference covering all JLPT levels with stroke order and readings.",
    bookGrammar: "A Dictionary of Basic/Intermediate Japanese Grammar",
    bookGrammarDesc: "The most trusted grammar reference for JLPT N5–N3 learners.",
    buyOnAmazon: "View on Amazon",
    affiliateDisclosure: "We may earn a commission from purchases made through these links. This helps keep JLPT Test Hub free.",
    learnJapaneseOnline: "Want Structured Japanese Lessons?",
    learnJapaneseDesc: "Interactive audio lessons, grammar guides, and vocabulary building from beginner to advanced.",
    tryJapanesePod: "Try JapanesePod101 →",
    studyInJapan: "Study Japanese in Japan",
    studyInJapanDesc: "Find language schools, apply for student visas, and immerse yourself in Japan.",
    exploreSchools: "Explore Schools →",
    // Premium strings
    goPro: "Go Pro",
    proTitle: "Upgrade to JLPT Test Hub Pro",
    proDesc: "Unlock the full JLPT preparation experience.",
    proFree: "Free",
    proPro: "Pro",
    freeFeatures: "30 questions per test, both test modes, furigana dictionary",
    proFeatures: "Unlimited questions, test history, progress analytics, weak-point tracking, ad-free, all 150+ questions unlocked, downloadable PDF results",
    proPrice: "$4.99/month or $29.99/year",
    proCTA: "Upgrade with Stripe",
    proCancel: "Maybe later",
    proFeature1: "✓ Unlimited questions per test (vs. 30 free)",
    proFeature2: "✓ Full test history & progress tracking",
    proFeature3: "✓ Weak-point analytics by category",
    proFeature4: "✓ All 150+ official questions unlocked",
    proFeature5: "✓ Downloadable PDF results & explanations",
    proFeature6: "✓ Ad-free experience",
    foundHelpful: "Found this helpful?",
    supportFree: "Support free JLPT prep",
  },
  de: {
    chooseExp: "Wählen Sie Ihr Erlebnis",
    chooseDesc: "Wählen Sie, wie Sie die JLPT App simulieren möchten.",
    desktopMode: "Desktop-Modus",
    desktopDesc: "Responsives Vollbild-Layout",
    mobileMode: "Handy-Simulator",
    mobileDesc: "Interaktiver Smartphone-Rahmen",
    selectLevel: "JLPT-Level wählen",
    selectLevelDesc: "Wählen Sie den Level, den Sie üben möchten.",
    title: "JLPT Test Hub — Kostenlose N5, N4, N3 Übungsprüfungen",
    subtitle: "DER #1 BESTE JLPT TESTSIMULATOR & VORBEREITUNGSLEITFADEN",
    basedOn: "Basierend auf offiziellen",
    selectMode: "Bitte wählen Sie unten einen Modus, um zu beginnen.",
    strict: "STRENG",
    guided: "GEFÜHRT",
    realTestTitle: "Echter simulierter Test",
    realTestDesc: (q: number, m: number) => `Simuliert das genaue offizielle Prüfungsformat. ${q} zufällige Fragen mit einem Zeitlimit von ${m} Minuten. Kein sofortiges Feedback.`,
    startReal: "Echten Test starten",
    learningTitle: "Lern- und Übungsmodus",
    learningDesc: "Übung ohne Zeitlimit. Erhalten Sie sofortige Erklärungen bei der Auswahl einer Antwort, um zu lernen, warum eine Option richtig oder falsch ist.",
    startLearning: "Lernmodus starten",
    passReq: "Bestehensvoraussetzung: 60% (Gilt für beide Modi)",
    learn: "Lernen",
    learningMode: "Lernmodus",
    question: "Frage",
    untimed: "Ohne Zeitlimit",
    untimedPractice: "Übung ohne Zeitlimit",
    clickKanji: "Kanji klicken",
    correct: "Richtig!",
    incorrect: "Falsch. Die richtige Antwort war Option",
    explanation: "Erklärung",
    noExp: "Für diese Frage ist keine Erklärung verfügbar.",
    prev: "Zurück",
    next: "Weiter",
    finish: "Beenden",
    testPassed: "Test bestanden!",
    testFailed: "Test nicht bestanden",
    mode: "Modus",
    practice: "Übung",
    real: "Echt",
    requirement: "Anforderung",
    yourScore: "Ihr Ergebnis",
    percentage: "Prozentsatz",
    backToStart: "Zurück zum Startmenü",
    detailedReview: "Detaillierte Überprüfung",
    unanswered: "Sie haben diese Frage nicht beantwortet.",
    meaning: "Bedeutung",
    context: "Kontext",
    unknown: "Unbekannt / Nicht im Wörterbuch",
    instruction: "Wählen Sie die beste Antwort für die Lücke (　　) aus Option 1・2・3・4.",
    home: "Startseite",
    restart: "Neu starten",
    supportUs: "Projekt unterstützen",
    supportModalTitle: "Kostenlose JLPT Vorbereitung unterstützen",
    supportModalDesc: "Dieses Projekt ist zu 100% kostenlos ohne Paywalls oder Abos. Wenn Ihnen dieses Tool bei der Vorbereitung auf Ihre JLPT-Prüfung geholfen hat, unterstützen Sie gerne die Serverkosten!",
    coffeeBtn: "☕ Einen Kaffee spendieren ($5)",
    close: "Schließen",
    correctLabel: "Richtig",
    incorrectLabel: "Falsch",
    level: "Level",
    recommendedBooks: "Empfohlene JLPT-Bücher",
    booksDesc: "Offizielle Übungshefte und Lernführer, die von JLPT-Kandidaten weltweit vertraut werden.",
    bookOfficialWorkbook: "JLPT Official Practice Workbook",
    bookOfficialDesc: "Der offizielle Leitfaden mit echten Prüfungsfragen für alle Level.",
    bookKanjiDict: "Kodansha Kanji Dictionary",
    bookKanjiDesc: "Umfassendes Kanji-Lexikon für alle JLPT-Level.",
    bookGrammar: "A Dictionary of Basic/Intermediate Japanese Grammar",
    bookGrammarDesc: "Die vertrauteste Grammatik-Referenz für JLPT N5–N3.",
    buyOnAmazon: "Auf Amazon ansehen",
    affiliateDisclosure: "Wir können eine Provision erhalten. Dies hält JLPT Test Hub kostenlos.",
    learnJapaneseOnline: "Strukturierte Japanisch-Kurse?",
    learnJapaneseDesc: "Interaktive Audio-Lektionen, Grammatik und Vokabular von Anfänger bis Fortgeschritten.",
    tryJapanesePod: "JapanesePod101 testen →",
    studyInJapan: "In Japan Japanisch studieren",
    studyInJapanDesc: "Sprachschulen finden, Studentenvisum beantragen und in Japan eintauchen.",
    exploreSchools: "Schulen erkunden →",
    goPro: "Pro",
    proTitle: "Auf JLPT Test Hub Pro upgraden",
    proDesc: "Schalten Sie die volle JLPT-Vorbereitung frei.",
    proFree: "Kostenlos",
    proPro: "Pro",
    freeFeatures: "30 Fragen pro Test, beide Modi, Furigana-Wörterbuch",
    proFeatures: "Unbegrenzte Fragen, Verlauf, Analyse, werbefrei, alle 150+ Fragen, PDF-Export",
    proPrice: "$4.99/Monat oder $29.99/Jahr",
    proCTA: "Mit Stripe upgraden",
    proCancel: "Vielleicht später",
    proFeature1: "✓ Unbegrenzte Fragen pro Test (vs. 30 kostenlos)",
    proFeature2: "✓ Vollständiger Testverlauf & Fortschrittsverfolgung",
    proFeature3: "✓ Schwachstellen-Analyse nach Kategorie",
    proFeature4: "✓ Alle 150+ offizielle Fragen freigeschaltet",
    proFeature5: "✓ PDF-Ergebnisse herunterladbar",
    proFeature6: "✓ Werbungsfrei",
    foundHelpful: "Nützlich gefunden?",
    supportFree: "Kostenlose JLPT-Vorbereitung unterstützen",
  }
};

interface SvgProps {
  className?: string;
}

const IconClock = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheck = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconAlertCircle = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconBookOpen = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconGlobe = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconHome = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconRefreshCw = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconHeart = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);


// Enhanced AdSense banner — ready for real AdSense code
// To activate: replace placeholder with <ins class="adsbygoogle" ...> and push
// Config — replace YOUR_PUBLISHER_ID with your real AdSense ID when approved
const ADSENSE_CONFIG = {
  client: "ca-pub-4082985236293156",
  slots: {
    "intro-top-banner": "1111111111",
    "intro-bottom-banner": "2222222222",
    "testing-mid-banner": "3333333333",
    "results-banner": "4444444444",
  } as Record<string, string>,
};
void ADSENSE_CONFIG; // Will be used when AdSense is activated

const GoogleAdBanner = ({ slotId = "auto-ads-slot" }: { slotId?: string }) => {
  return (
    <div className="w-full bg-gray-100 border border-dashed border-gray-300 rounded-xl p-3 my-4 text-center text-xs text-gray-400 select-none overflow-hidden">
      {/*
        ACTIVATION INSTRUCTIONS:
        1. Get approved by Google AdSense (adsense.google.com)
        2. Replace ADSENSE_CLIENT above with your publisher ID
        3. Replace this placeholder block with:
           <ins className="adsbygoogle" style={{display:'block'}}
             data-ad-client={ADSENSE_CLIENT}
             data-ad-slot={ADSENSE_SLOTS[slotId] || slotId}
             data-ad-format="auto" data-full-width-responsive="true"></ins>
        4. Add (adsbygoogle = window.adsbygoogle || []).push({}) in a useEffect
        5. Add the AdSense script in index.html <head>
      */}
      <div className="flex flex-col items-center justify-center py-2 space-y-1">
        <span className="font-bold tracking-widest uppercase text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded">Advertisement</span>
        <div className="h-12 flex items-center justify-center text-gray-400 font-mono text-xs">
          Google AdSense Responsive Unit [{slotId}]
        </div>
      </div>
    </div>
  );
};

// Amazon Associates — Recommended JLPT Books
const BookRecommendations = ({ t, lang }: { t: any; lang: string }) => {
  const books = [
    {
      title: t.bookOfficialWorkbook,
      desc: t.bookOfficialDesc,
      img: "📚",
      // Replace YOUR-AFFILIATE-TAG with your Amazon Associates tag
      link: "https://www.amazon.com/s?k=JLPT+official+practice+workbook&tag=jlpttesthub-20",
    },
    {
      title: t.bookKanjiDict,
      desc: t.bookKanjiDesc,
      img: "📖",
      link: "https://www.amazon.com/s?k=kodansha+kanji+dictionary&tag=jlpttesthub-20",
    },
    {
      title: t.bookGrammar,
      desc: t.bookGrammarDesc,
      img: "📝",
      link: "https://www.amazon.com/s?k=dictionary+basic+japanese+grammar&tag=jlpttesthub-20",
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-bold text-gray-700" style={{ fontSize: '1.125rem' }}>
          {t.recommendedBooks}
        </h2>
        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{lang === 'de' ? 'Werbung' : 'Advertisement'}</span>
      </div>
      <p className="text-gray-500 text-xs mb-4">{t.booksDesc}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {books.map((book, i) => (
          <a
            key={i}
            href={book.link}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-emerald-300 transition-all group"
          >
            <div className="text-3xl mb-2">{book.img}</div>
            <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors">{book.title}</h3>
            <p className="text-gray-500 text-xs mb-2 leading-relaxed">{book.desc}</p>
            <span className="text-emerald-600 font-bold text-xs group-hover:underline">{t.buyOnAmazon}</span>
          </a>
        ))}
      </div>
      <p className="text-gray-300 text-[10px] mt-2 leading-relaxed">{t.affiliateDisclosure}</p>
      <p className="text-gray-300 text-[10px] mt-1 leading-relaxed">{lang === 'de' ? 'Als Amazon-Partner verdiene ich an qualifizierten Käufen.' : 'As an Amazon Associate, I earn from qualifying purchases.'}</p>
    </div>
  );
};

// JapanesePod101 Affiliate Banner
const AffiliateBanner = ({ t, lang }: { t: any; lang: string }) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">🎧</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm">{t.learnJapaneseOnline}</h3>
            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{lang === 'de' ? 'Werbung' : 'Advertisement'}</span>
          </div>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">{t.learnJapaneseDesc}</p>
          <a
            href="https://www.japanesepod101.com/member/go.php?r=YOUR_AFFILIATE_ID"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            {t.tryJapanesePod}
          </a>
        </div>
      </div>
    </div>
  );
};

// Go! Go! Nihon — Study in Japan affiliate
const StudyInJapanBanner = ({ t, lang }: { t: any; lang: string }) => {
  return (
    <div className="mt-4 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="text-3xl shrink-0">🇯🇵</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm">{t.studyInJapan}</h3>
            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{lang === 'de' ? 'Werbung' : 'Advertisement'}</span>
          </div>
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">{t.studyInJapanDesc}</p>
          <a
            href="https://www.gogonihon.com/en/?ref=jlpttesthub"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            {t.exploreSchools}
          </a>
        </div>
      </div>
    </div>
  );
};

// Premium upgrade modal
const PremiumModal = ({ show, onClose, t }: { show: boolean; onClose: () => void; t: any }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
              <IconBookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t.proTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">{t.proDesc}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">{t.proFree}</div>
            <div className="text-2xl font-black text-gray-700 mb-2">$0</div>
            <p className="text-gray-500 text-xs leading-relaxed">{t.freeFeatures}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-400">
            <div className="text-xs font-bold text-emerald-500 uppercase mb-1">{t.proPro}</div>
            <div className="text-2xl font-black text-emerald-600 mb-2">$4.99<span className="text-sm font-normal text-gray-400">/mo</span></div>
            <p className="text-gray-600 text-xs leading-relaxed">{t.proFeatures}</p>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="text-xs text-gray-600">{t.proFeature1}</div>
          <div className="text-xs text-gray-600">{t.proFeature2}</div>
          <div className="text-xs text-gray-600">{t.proFeature3}</div>
          <div className="text-xs text-gray-600">{t.proFeature4}</div>
          <div className="text-xs text-gray-600">{t.proFeature5}</div>
          <div className="text-xs text-gray-600">{t.proFeature6}</div>
        </div>
        <a
          href="https://checkout.stripe.com/pay/pro"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
        >
          {t.proCTA}
        </a>
        <div className="text-center text-xs text-gray-400 mt-2">{t.proPrice}</div>
        <button onClick={onClose} className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors">
          {t.proCancel}
        </button>
      </div>
    </div>
  );
};

// ===== LEGAL COMPLIANCE COMPONENTS =====

// Cookie consent state
const COOKIE_KEY = 'jlpt-consent-v1';
const getConsent = (): { essential: boolean; advertising: boolean; affiliate: boolean } | null => {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};
const setConsent = (consent: { essential: boolean; advertising: boolean; affiliate: boolean }) => {
  try { localStorage.setItem(COOKIE_KEY, JSON.stringify(consent)); } catch {}
};

// Cookie consent banner (GDPR-compliant)
const CookieBanner = ({ onConsent }: { onConsent: () => void }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [affiliate, setAffiliate] = useState(false);

  const acceptAll = () => {
    setConsent({ essential: true, advertising: true, affiliate: true });
    onConsent();
  };
  const rejectAll = () => {
    setConsent({ essential: true, advertising: false, affiliate: false });
    onConsent();
  };
  const saveSettings = () => {
    setConsent({ essential: true, advertising, affiliate });
    onConsent();
  };

  if (getConsent()) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-gray-900 text-white p-4 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex-1 text-sm text-gray-200">
              <span className="font-bold">🍪 Cookies & Privacy</span>
              <span className="ml-2 text-gray-400">We use essential cookies for the app to work. With your consent, we also use advertising (Google AdSense) and affiliate tracking cookies. See our <a href="#/privacy" className="underline text-emerald-400">Privacy Policy</a>.</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={rejectAll} className="px-4 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Reject</button>
              <button onClick={() => setShowSettings(true)} className="px-4 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Settings</button>
              <button onClick={acceptAll} className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Accept all</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-bold text-sm">Cookie Settings</h3>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked disabled className="accent-emerald-500" />
              <span className="text-gray-300">Essential (required for the app to function)</span>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} className="accent-emerald-500" />
              <span className="text-gray-300">Advertising (Google AdSense — personalized ads)</span>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={affiliate} onChange={e => setAffiliate(e.target.checked)} className="accent-emerald-500" />
              <span className="text-gray-300">Affiliate tracking (Amazon, JapanesePod101, etc.)</span>
            </label>
            <div className="flex gap-2">
              <button onClick={saveSettings} className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">Save settings</button>
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Legal modal (reusable for Privacy, Terms, Seller info)
const LegalModal = ({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 border border-gray-100" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors shrink-0">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-600 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Privacy Policy content (GDPR + APPI compliant)
const PrivacyPolicyContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">1. Overview</h3>
    <p>JLPT Test Hub ("we", "us") is a free online JLPT practice test platform. This Privacy Policy explains how we handle your data in compliance with the EU General Data Protection Regulation (GDPR) and the Japanese Act on the Protection of Personal Information (APPI).</p>

    <h3 className="font-bold text-gray-800 text-base">2. Data We Collect</h3>
    <p><strong>Essential data:</strong> Your test answers and scores are stored temporarily in your browser's memory during a test session. No personal data is sent to our servers — the app runs entirely in your browser.</p>
    <p><strong>Cookies:</strong> We use a consent cookie to remember your cookie preferences. With your consent, third-party cookies may be set (see below).</p>
    <p><strong>We do NOT collect:</strong> names, email addresses, IP addresses, or any personally identifiable information. We do not have user accounts.</p>

    <h3 className="font-bold text-gray-800 text-base">3. Third-Party Services</h3>
    <p>If you have given consent, the following third parties may process your data:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li><strong>Google AdSense:</strong> Displays ads and may set cookies for ad personalization. Google may collect IP address, cookie IDs, and browsing data. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Google's Privacy Policy</a>.</li>
      <li><strong>Amazon Associates:</strong> Affiliate links to Amazon may set tracking cookies to attribute referrals. Amazon may collect click data and IP address. See <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8HYFRX5" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">Amazon's Privacy Notice</a>.</li>
      <li><strong>JapanesePod101 (Innovative Language):</strong> Affiliate links may set tracking cookies. See their <a href="https://www.japanesepod101.com/helpdesk/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">privacy policy</a>.</li>
      <li><strong>PayPal:</strong> If you purchase a Pro subscription or donate, PayPal processes your payment data. We do not see or store your card details. See <a href="https://www.paypal.com/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">PayPal's Privacy Policy</a>.</li>
      <li><strong>Buy Me a Coffee:</strong> If you donate, BMC processes your transaction. See their <a href="https://www.buymeacoffee.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">privacy policy</a>.</li>
    </ul>

    <h3 className="font-bold text-gray-800 text-base">4. Legal Basis (GDPR Art. 6)</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Consent (Art. 6(1)(a)) — for advertising and affiliate cookies</li>
      <li>Legitimate interest (Art. 6(1)(f)) — for essential app functionality</li>
      <li>Contract performance (Art. 6(1)(b)) — for premium subscription processing</li>
    </ul>

    <h3 className="font-bold text-gray-800 text-base">5. Your Rights</h3>
    <p>Under GDPR, you have the right to: access, rectification, erasure, restriction, portability, and objection. Under APPI, you have the right to request disclosure, correction, and deletion of your personal information.</p>
    <p>To exercise these rights, contact us at the email listed in our seller disclosure.</p>

    <h3 className="font-bold text-gray-800 text-base">6. Cookie Management</h3>
    <p>You can withdraw consent at any time by clicking "Cookie Settings" in the footer or by clearing your browser's cookies.</p>

    <h3 className="font-bold text-gray-800 text-base">7. Data Retention</h3>
    <p>We do not store personal data on our servers. Cookie data is retained according to each third party's policy (typically 30–365 days).</p>

    <h3 className="font-bold text-gray-800 text-base">8. Children's Privacy</h3>
    <p>The JLPT is typically taken by adults and older students. We do not knowingly collect data from children under 13. If you believe a child has provided personal data, please contact us.</p>

    <h3 className="font-bold text-gray-800 text-base">9. Changes to This Policy</h3>
    <p>We may update this policy. Changes are effective when posted on this page.</p>

    <h3 className="font-bold text-gray-800 text-base">10. Contact</h3>
    <p>See seller disclosure below for contact information.</p>
  </>
);

// Terms of Service content
const TermsContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">1. Acceptance of Terms</h3>
    <p>By using JLPT Test Hub, you agree to these Terms of Service. If you do not agree, please do not use the site.</p>

    <h3 className="font-bold text-gray-800 text-base">2. Service Description</h3>
    <p>JLPT Test Hub provides free online JLPT practice tests for levels N5, N4, and N3, featuring official exam questions, an interactive furigana dictionary, and timed simulation modes.</p>

    <h3 className="font-bold text-gray-800 text-base">3. Free Tier</h3>
    <p>The free tier includes: 30 questions per test, both test modes (real and learning), the furigana dictionary, and all JLPT levels. No registration required.</p>

    <h3 className="font-bold text-gray-800 text-base">4. Premium Subscription (Pro)</h3>
    <p>Pro subscription is $4.99/month or $29.99/year, billed via Stripe. Features include: unlimited questions per test, test history, ad-free experience, and downloadable results. Subscription auto-renews until cancelled.</p>

    <h3 className="font-bold text-gray-800 text-base">5. Refund Policy</h3>
    <p><strong>Monthly subscriptions:</strong> You may request a full refund within 7 days of purchase if you have not used Pro features more than once.</p>
    <p><strong>Annual subscriptions:</strong> You may request a full refund within 14 days of purchase. After 14 days, refunds are pro-rated for unused months.</p>
    <p><strong>Donations:</strong> Donations via Buy Me a Coffee are voluntary and non-refundable.</p>
    <p>To request a refund, contact us at the email listed in our seller disclosure.</p>

    <h3 className="font-bold text-gray-800 text-base">6. Intellectual Property</h3>
    <p>JLPT questions are sourced from the official JLPT Practice Workbook published by the Japan Foundation and JEES. The app interface, code, and design are our intellectual property. You may not copy, redistribute, or reverse-engineer the application.</p>

    <h3 className="font-bold text-gray-800 text-base">7. Disclaimer</h3>
    <p>This is an unofficial practice tool and is not affiliated with or endorsed by the Japan Foundation or JEES. Practice results do not guarantee actual JLPT exam results.</p>

    <h3 className="font-bold text-gray-800 text-base">8. Limitation of Liability</h3>
    <p>We are not liable for any damages arising from the use of this service, including but not limited to exam failure, data loss, or service interruption.</p>

    <h3 className="font-bold text-gray-800 text-base">9. Governing Law</h3>
    <p>These terms are governed by the laws of Japan.</p>
  </>
);

// Japanese 特定商取引法 (Specified Commercial Transactions Law) seller disclosure
const SellerDisclosureContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">特定商取引法に基づく表示 — Seller Disclosure</h3>
    <div className="space-y-2 text-xs">
      <p><strong>販売事業者 (Seller):</strong> [YOUR NAME]</p>
      <p><strong>所在地 (Address):</strong> [YOUR ADDRESS IN JAPAN]</p>
      <p><strong>連絡先 (Contact):</strong> [YOUR EMAIL] / [YOUR PHONE]</p>
      <p><strong>販売価格 (Price):</strong> Free (basic), $4.99/month or $29.99/year (Pro)</p>
      <p><strong>支払方法 (Payment):</strong> Stripe, Buy Me a Coffee</p>
      <p><strong>引渡し時期 (Delivery):</strong> Immediate (digital service, browser-based)</p>
      <p><strong>返金・キャンセル (Refund/Cancellation):</strong> See Terms of Service. Monthly: 7-day refund window. Annual: 14-day full refund, then pro-rated.</p>
      <p><strong>動作環境 (Requirements):</strong> Modern web browser with JavaScript enabled</p>
      <p><strong>個人情報保護 (Privacy):</strong> See Privacy Policy</p>
    </div>
    <p className="text-xs text-gray-400 mt-4 italic">※ Update with your real information after registering as a sole proprietor (個人事業) in Japan.</p>
  </>
);

// Footer with legal links
const Footer = ({ onPrivacy, onTerms, onSeller, onCookies, lang }: { onPrivacy: () => void; onTerms: () => void; onSeller: () => void; onCookies: () => void; lang: string }) => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-4 mt-8 shrink-0">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <button onClick={onPrivacy} className="hover:text-emerald-400 transition-colors">{lang === 'de' ? 'Datenschutz' : 'Privacy Policy'}</button>
          <span className="text-gray-600">·</span>
          <button onClick={onTerms} className="hover:text-emerald-400 transition-colors">{lang === 'de' ? 'AGB' : 'Terms of Service'}</button>
          <span className="text-gray-600">·</span>
          <button onClick={onSeller} className="hover:text-emerald-400 transition-colors">Seller Disclosure (特定商取引法)</button>
          <span className="text-gray-600">·</span>
          <button onClick={onCookies} className="hover:text-emerald-400 transition-colors">Cookie Settings</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">© {new Date().getFullYear()} JLPT Test Hub. Not affiliated with the Japan Foundation or JEES. JLPT is a registered trademark.</p>
      </div>
    </footer>
  );
};

const renderFurigana = (text: string, onKanjiClick?: (kanji: string, furigana: string) => void) => {
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
            if (onKanjiClick) {
              e.preventDefault();
              e.stopPropagation();
              onKanjiClick(kanji, furigana);
            }
          }}
          className={`inline-block align-bottom ${onKanjiClick ? 'cursor-pointer hover:bg-emerald-100 rounded px-0.5 transition-colors' : ''}`}
          title={onKanjiClick ? "Click for meaning" : ""}
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

const shuffleArray = <T,>(array: T[]): T[] => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface SelectedKanji extends KanjiEntry {
  kanji: string;
  furigana: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [testMode, setTestMode] = useState<TestMode>('real');
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [learningAnswerRevealed, setLearningAnswerRevealed] = useState(false);
  const [selectedKanjiInfo, setSelectedKanjiInfo] = useState<SelectedKanji | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [cookieConsentGiven, setCookieConsentGiven] = useState(() => !!getConsent());
  const [lang, setLang] = useState<Lang>('en');

  // Auto-detect mobile vs desktop
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 768px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const currentData: LevelData = levelData[selectedLevel];
  const t = uiTranslations[lang];

  useEffect(() => {
    document.title = lang === 'de'
      ? `Kostenloser JLPT ${selectedLevel} Testsimulator & Vorbereitung | JLPT Test Hub`
      : `Free JLPT ${selectedLevel} Practice Test & Simulator | JLPT Test Hub`;

    let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = lang === 'de'
      ? `Der #1 beste JLPT ${selectedLevel} Testsimulator. Üben Sie echte ${selectedLevel}-Prüfungsfragen mit interaktivem Furigana-Wörterbuch, sofortigem Feedback und offiziellen Standards.`
      : `The #1 best JLPT ${selectedLevel} test simulator. Practice authentic ${selectedLevel} questions with interactive Furigana dictionary, instant feedback, and official standards.`;

    let ogTitle = document.querySelector("meta[property='og:title']") as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = document.title;

    let ogDesc = document.querySelector("meta[property='og:description']") as HTMLMetaElement | null;
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = metaDesc.content;

    let jsonLd = document.querySelector("script[type='application/ld+json']") as HTMLScriptElement | null;
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "JLPT Test Hub",
      "alternateName": `JLPT ${selectedLevel} Online Practice Exam`,
      "url": window.location.href,
      "description": metaDesc.content,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "educationalLevel": selectedLevel,
      "learningResourceType": "Practice Test"
    });
  }, [lang, selectedLevel]);

  // Hash-based routing: #/n5, #/n4, #/n3
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('n5')) setSelectedLevel('N5');
      else if (hash.includes('n4')) setSelectedLevel('N4');
      else if (hash.includes('n3')) setSelectedLevel('N3');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when level changes
  const updateHash = (level: JLPTLevel) => {
    const newHash = `#/${level.toLowerCase()}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  };

  const startTest = (mode: TestMode) => {
    setTestMode(mode);
    const selected = shuffleArray(currentData.questionBank).slice(0, currentData.questionsPerTest);
    setTestQuestions(selected);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setLearningAnswerRevealed(false);
    if (mode === 'real') {
      setTimeRemaining(currentData.timeMinutes * 60);
    } else {
      setTimeRemaining(0);
    }
    setGameState('testing');
  };

  const restartTest = () => {
    startTest(testMode);
  };

  const goHome = () => {
    setGameState('intro');
  };

  const submitTest = useCallback(() => {
    setGameState('results');
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (gameState === 'testing' && testMode === 'real' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, testMode, timeRemaining]);

  useEffect(() => {
    if (gameState === 'testing' && testMode === 'real' && timeRemaining === 0 && testQuestions.length > 0) {
      submitTest();
    }
  }, [gameState, testMode, timeRemaining, testQuestions.length, submitTest]);

  const handleSelectOption = (optionIndex: number) => {
    if (testMode === 'learning' && learningAnswerRevealed) return;
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    if (testMode === 'learning') {
      setLearningAnswerRevealed(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setLearningAnswerRevealed(testMode === 'learning' && answers[nextIdx] !== undefined);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setLearningAnswerRevealed(testMode === 'learning' && answers[prevIdx] !== undefined);
    }
  };

  const results = useMemo(() => {
    if (gameState !== 'results') return null;
    let score = 0;
    testQuestions.forEach((q, index) => {
      if (answers[index] === q.correctIndex) score++;
    });
    const percentage = testQuestions.length > 0 ? (score / testQuestions.length) * 100 : 0;
    const isPass = percentage >= currentData.passThreshold * 100;
    return { score, percentage, isPass };
  }, [gameState, testQuestions, answers, currentData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleKanjiClick = (kanji: string, furigana: string) => {
    const entry = currentData.kanjiDictionary[kanji];
    setSelectedKanjiInfo({ kanji, furigana, ...(entry ?? { meaning: { en: t.unknown, de: t.unknown }, desc: { en: '', de: '' } }) });
  };

  const renderKanjiModal = () => {
    if (!selectedKanjiInfo) return null;
    return (
      <div
        className={`${isMobile ? 'absolute' : 'fixed'} inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm`}
        onClick={() => setSelectedKanjiInfo(null)}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <span className="text-emerald-600 font-bold tracking-widest text-sm mb-1">{selectedKanjiInfo.furigana}</span>
              <h3 className="text-5xl md:text-6xl font-black text-gray-900 leading-none">{selectedKanjiInfo.kanji}</h3>
            </div>
            <button
              onClick={() => setSelectedKanjiInfo(null)}
              className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.meaning}</h4>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {selectedKanjiInfo.meaning ? selectedKanjiInfo.meaning[lang] : t.unknown}
              </p>
            </div>
            {selectedKanjiInfo.desc && selectedKanjiInfo.desc[lang] && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t.context}</h4>
                <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl">
                  {selectedKanjiInfo.desc[lang]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSupportModal = () => {
    if (!showSupportModal) return null;
    return (
      <div
        className={`${isMobile ? 'absolute' : 'fixed'} inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm`}
        onClick={() => setShowSupportModal(false)}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-pink-100 text-pink-600 p-2 rounded-xl">
                <IconHeart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t.supportModalTitle}</h3>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{t.supportModalDesc}</p>
          <div className="space-y-3">
            <a
              href="https://buymeacoffee.com/created.by"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#FFDD00] hover:bg-[#f3d300] text-gray-900 font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
            >
              {t.coffeeBtn}
            </a>
          </div>
          <button
            onClick={() => setShowSupportModal(false)}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    );
  };

  const renderLevelSwitcher = (variant: 'light' | 'dark' = 'light') => {
    return (
      <div className="flex items-center gap-1.5">
        {allLevels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setSelectedLevel(lvl);
              updateHash(lvl);
              if (gameState !== 'intro') goHome();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95 ${
              selectedLevel === lvl
                ? variant === 'dark'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : variant === 'dark'
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    );
  };

  const renderNavControls = () => {
    return (
      <nav aria-label="Quick Actions" className="flex items-center gap-1.5 ml-auto">
        {renderLevelSwitcher()}
        <button
          onClick={() => setShowPremiumModal(true)}
          title={t.goPro}
          className="flex items-center gap-1 text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          <span>⭐</span>
          <span className="hidden sm:inline">{t.goPro}</span>
        </button>
        <button
          onClick={() => setShowSupportModal(true)}
          title={t.supportUs}
          className="flex items-center gap-1 text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          <IconHeart className="w-4 h-4" />
          <span className="hidden sm:inline">{t.supportUs}</span>
        </button>
        <button
          onClick={goHome}
          title={t.home}
          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          <IconHome className="w-4 h-4" />
          <span className="hidden sm:inline">{t.home}</span>
        </button>
        {gameState === 'testing' && (
          <button
            onClick={restartTest}
            title={t.restart}
            className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-md text-xs font-bold transition-colors"
          >
            <IconRefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{t.restart}</span>
          </button>
        )}
        <button
          onClick={() => setLang(l => (l === 'en' ? 'de' : 'en'))}
          className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          <IconGlobe className="w-4 h-4" />
          {lang === 'en' ? 'DE' : 'EN'}
        </button>
      </nav>
    );
  };

  const renderAppContent = () => {
    if (gameState === 'intro') {
      return (
        <main className={`bg-gray-50 text-gray-800 flex items-center justify-center font-sans flex-1 relative ${isMobile ? 'min-h-full p-0' : 'min-h-screen p-4'}`}>
          <div className="absolute top-4 right-4 z-[60] flex items-center gap-2">
            <button
              onClick={() => setShowSupportModal(true)}
              className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-pink-600 hover:bg-pink-100 px-3 py-1.5 rounded-full shadow-sm transition-all active:scale-95 font-bold text-sm"
            >
              <IconHeart className="w-4 h-4" />
              <span>{t.supportUs}</span>
            </button>
            <button
              onClick={() => setLang(l => (l === 'en' ? 'de' : 'en'))}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-emerald-600 hover:border-emerald-300 px-3 py-1.5 rounded-full shadow-sm transition-all active:scale-95 font-bold text-sm"
            >
              <IconGlobe className="w-4 h-4" />
              {lang === 'en' ? 'Deutsch' : 'English'}
            </button>
          </div>
          <div className={`w-full bg-white overflow-hidden flex flex-col ${isMobile ? 'max-w-full rounded-none shadow-none min-h-full' : 'max-w-3xl rounded-2xl shadow-xl border border-gray-100'}`}>
            <header className={`bg-emerald-600 text-center text-white shrink-0 ${isMobile ? 'p-6 pt-16' : 'p-8'}`}>
              <h1 className={`font-bold mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{currentData.uiStrings.title}</h1>
              <p className={`text-emerald-100 opacity-90 ${isMobile ? 'text-xs' : 'text-sm'}`}>{currentData.uiStrings.subtitle}</p>
            </header>
            <section className={`flex-1 flex flex-col ${isMobile ? 'p-4 overflow-y-auto' : 'p-8'}`}>
              <GoogleAdBanner slotId="intro-top-banner" />

              <div className={`mb-6 ${isMobile ? '' : 'mb-8'}`}>
                <h2 className={`text-center font-bold text-gray-700 mb-3 ${isMobile ? 'text-base' : 'text-lg'}`}>{t.selectLevel}</h2>
                <div className="flex justify-center">
                  {renderLevelSwitcher()}
                </div>
              </div>

              <p className={`text-gray-600 text-center ${isMobile ? 'mb-6 text-sm' : 'mb-8'}`}>
                {currentData.uiStrings.basedOn} <strong>{currentData.uiStrings.guidelineDoc}</strong>. {t.selectMode}
              </p>
              <div className={`grid gap-4 flex-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
                <div className={`border border-gray-200 rounded-xl hover:shadow-lg transition-shadow flex flex-col bg-white relative overflow-hidden ${isMobile ? 'p-5' : 'p-6'}`}>
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t.strict}</div>
                  <div className="text-emerald-600 mb-3 bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <h2 className={`font-bold text-gray-800 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>{t.realTestTitle}</h2>
                  <p className={`text-gray-500 mb-4 flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {t.realTestDesc(currentData.questionsPerTest, currentData.timeMinutes)}
                  </p>
                  <button
                    onClick={() => startTest('real')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all active:scale-95 text-sm md:text-base mt-auto"
                  >
                    {t.startReal}
                  </button>
                </div>
                <div className={`border border-blue-200 rounded-xl hover:shadow-lg transition-shadow flex flex-col bg-blue-50 relative overflow-hidden ${isMobile ? 'p-5' : 'p-6'}`}>
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t.guided}</div>
                  <div className="text-blue-600 mb-3 bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <IconBookOpen className="w-5 h-5" />
                  </div>
                  <h2 className={`font-bold text-blue-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>{t.learningTitle}</h2>
                  <p className={`text-blue-700/80 mb-4 flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {t.learningDesc}
                  </p>
                  <button
                    onClick={() => startTest('learning')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all active:scale-95 text-sm md:text-base mt-auto"
                  >
                    {t.startLearning}
                  </button>
                </div>
              </div>
              <GoogleAdBanner slotId="intro-bottom-banner" />

              {/* Affiliate: Recommended JLPT Books */}
              <BookRecommendations t={t} lang={lang} />

              {/* Affiliate: JapanesePod101 */}
              <AffiliateBanner t={t} lang={lang} />

              {/* Affiliate: Study in Japan */}
              <StudyInJapanBanner t={t} lang={lang} />

              <div className={`text-center text-gray-400 shrink-0 ${isMobile ? 'mt-4 text-xs' : 'mt-8 text-sm'}`}>
                {t.passReq}
              </div>

              {/* FAQ Section for SEO */}
              <div className={`mt-8 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <h2 className={`font-bold text-gray-700 mb-4 ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {lang === 'de' ? 'Häufig gestellte Fragen (FAQ)' : 'Frequently Asked Questions (FAQ)'}
                </h2>
                <div className="space-y-3">
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Was ist der JLPT?' : 'What is the JLPT?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Der JLPT (Japanese-Language Proficiency Test) ist die offizielle Prüfung für Japanisch-Kenntnisse, durchgeführt von der Japan Foundation und JEES. Er hat fünf Level: N5 (Anfänger) bis N1 (Fortgeschritten). Die Prüfung findet zweimal jährlich im Juli und Dezember statt.'
                        : 'The JLPT (Japanese-Language Proficiency Test) is the official certification of Japanese language ability, run by the Japan Foundation and JEES. It has five levels: N5 (beginner) to N1 (advanced). The test is held twice a year, in July and December.'}
                    </p>
                  </details>
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Sind diese Fragen echt?' : 'Are these real JLPT questions?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Ja. Unsere Fragen stammen aus dem offiziellen JLPT Practice Workbook (2018 Edition), veröffentlicht von der Japan Foundation. Es sind echte Fragen aus tatsächlichen Prüfungen seit der Revision 2010.'
                        : 'Yes. Our questions are sourced from the official JLPT Practice Workbook (2018 edition), published by the Japan Foundation. These are real questions selected from actual tests administered since the 2010 revision.'}
                    </p>
                  </details>
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Ist dieser Test kostenlos?' : 'Is this practice test free?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Ja. JLPT Test Hub ist zu 100% kostenlos — keine Anmeldung, keine Paywalls, keine Abos. Alle Fragen, das Furigana-Wörterbuch und beide Testmodi sind komplett frei.'
                        : 'Yes. JLPT Test Hub is 100% free with no signup, no paywalls, and no subscriptions. All questions, the furigana dictionary, and both test modes are completely free.'}
                    </p>
                  </details>
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Was ist Furigana?' : 'What is furigana?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Furigana sind kleine Lesungshilfen (Hiragana), die über Kanji geschrieben werden, um ihre Aussprache anzuzeigen. Unser Simulator bietet interaktive Furigana — klicken Sie auf ein Kanji in einer Frage, um Lesung, Bedeutung und Kontext zu sehen.'
                        : 'Furigana are small phonetic guides (hiragana) printed above kanji to show their pronunciation. Our simulator includes interactive furigana — click any kanji in a question to see its reading, meaning, and usage context.'}
                    </p>
                  </details>
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Wie bereite ich mich am besten vor?' : 'How should I prepare for the JLPT?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Beginnen Sie mit dem Lernmodus (ohne Zeitlimit, mit Erklärungen), um Grammatik und Vokabular zu verstehen. Wechseln Sie dann zum echten Testmodus (mit Zeitlimit, ohne Feedback), um Prüfungsbedingungen zu simulieren. Zielen Sie konstant auf über 60%, bevor Sie die echte Prüfung ablegen.'
                        : 'Start with Learning Mode (untimed, instant explanations) to understand the grammar and vocabulary. Then switch to Real Test Mode (timed, no feedback) to simulate exam conditions. Aim for 60%+ consistently before the real exam.'}
                    </p>
                  </details>
                </div>
              </div>

              {/* Level Info Table for SEO */}
              <div className={`mt-8 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <h2 className={`font-bold text-gray-700 mb-4 ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {lang === 'de' ? 'JLPT Level im Vergleich' : 'JLPT Level Comparison'}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">Level</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{lang === 'de' ? 'Kanji' : 'Kanji'}</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{lang === 'de' ? 'Vokabular' : 'Vocabulary'}</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{lang === 'de' ? 'Zeit' : 'Time'}</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{lang === 'de' ? 'Bestehensgrenze' : 'Pass Mark'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-2 font-bold text-emerald-600">N5</td>
                        <td className="px-4 py-2 text-gray-600">~100</td>
                        <td className="px-4 py-2 text-gray-600">~800</td>
                        <td className="px-4 py-2 text-gray-600">90 min</td>
                        <td className="px-4 py-2 text-gray-600">80/180</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-2 font-bold text-emerald-600">N4</td>
                        <td className="px-4 py-2 text-gray-600">~300</td>
                        <td className="px-4 py-2 text-gray-600">~1,500</td>
                        <td className="px-4 py-2 text-gray-600">115 min</td>
                        <td className="px-4 py-2 text-gray-600">90/180</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold text-emerald-600">N3</td>
                        <td className="px-4 py-2 text-gray-600">~650</td>
                        <td className="px-4 py-2 text-gray-600">~3,000–4,000</td>
                        <td className="px-4 py-2 text-gray-600">125 min</td>
                        <td className="px-4 py-2 text-gray-600">95/180</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      );
    }

    if (gameState === 'testing' && testQuestions.length > 0) {
      const currentQuestion = testQuestions[currentQuestionIndex];
      const hasAnsweredCurrent = answers[currentQuestionIndex] !== undefined;
      const isLastQuestion = currentQuestionIndex === testQuestions.length - 1;
      const showFeedback = testMode === 'learning' && learningAnswerRevealed;
      const isAnswerCorrect = answers[currentQuestionIndex] === currentQuestion.correctIndex;

      return (
        <div className="bg-gray-50 text-gray-800 flex flex-col font-sans flex-1 min-h-full">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm shrink-0">
            <div className={`mx-auto flex justify-between items-center ${isMobile ? 'px-4 py-3 pt-8' : 'max-w-4xl px-4 py-4'}`}>
              <div className="flex items-center gap-2">
                <div className={`text-xs md:text-sm font-semibold uppercase tracking-wide ${testMode === 'learning' ? 'text-blue-500' : 'text-gray-500'}`}>
                  {testMode === 'learning' ? (isMobile ? t.learn : t.learningMode) : t.question}
                </div>
                <div className={`bg-gray-100 text-gray-800 font-bold rounded-md flex items-center ${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1'}`}>
                  {currentQuestionIndex + 1} <span className="text-gray-400 font-normal ml-1">/ {testQuestions.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {testMode === 'real' ? (
                  <div className={`flex items-center gap-1.5 font-mono font-bold rounded-lg border ${isMobile ? 'text-sm px-2 py-1' : 'text-lg px-4 py-1.5'} ${timeRemaining < 300 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                    <IconClock className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                    {formatTime(timeRemaining)}
                  </div>
                ) : (
                  <div className={`flex items-center gap-1.5 font-mono text-xs md:text-sm rounded-lg border bg-blue-50 text-blue-700 border-blue-100 ${isMobile ? 'px-2 py-1' : 'px-4 py-1.5'}`}>
                    <IconBookOpen className="w-3 h-3 md:w-4 md:h-4" /> {isMobile ? t.untimed : t.untimedPractice}
                  </div>
                )}
                {renderNavControls()}
              </div>
            </div>
            <div className="h-1 bg-gray-100 w-full">
              <div
                className={`h-full transition-all duration-300 ${testMode === 'learning' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                style={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
              ></div>
            </div>
          </header>

          <main className={`flex-1 w-full mx-auto flex flex-col ${isMobile ? 'max-w-full px-3 py-4' : 'max-w-4xl px-4 py-8 md:py-12'}`}>
            <article className={`bg-white shadow-sm border border-gray-200 mb-4 ${isMobile ? 'rounded-xl p-4 md:p-5' : 'rounded-2xl p-6 md:p-10'}`}>
              <div className={`text-gray-500 border-b border-gray-100 pb-3 flex justify-between items-end ${isMobile ? 'text-xs mb-4' : 'text-sm mb-6'}`}>
                <span>{renderFurigana(currentData.instruction, handleKanjiClick)}</span>
                {testMode === 'learning' && <span className="text-blue-400 italic shrink-0 ml-2">{t.clickKanji}</span>}
              </div>
              <h2 className={`text-gray-900 leading-relaxed whitespace-pre-wrap font-medium pb-1 pt-1 ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                {renderFurigana(currentQuestion.text, handleKanjiClick)}
              </h2>
              <div className={`mt-6 grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:mt-10 md:gap-4'}`}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  let buttonStyle = "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700 cursor-pointer";
                  let badgeStyle = "border-gray-300 text-gray-400";
                  if (testMode === 'real') {
                    if (isSelected) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm cursor-pointer";
                      badgeStyle = "border-emerald-500 bg-emerald-500 text-white";
                    }
                  } else if (testMode === 'learning') {
                    if (showFeedback) {
                      buttonStyle = "border-gray-200 opacity-60 cursor-default";
                      if (isCorrectOption) {
                        buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500 ring-offset-1 cursor-default";
                        badgeStyle = "border-emerald-500 bg-emerald-500 text-white";
                      } else if (isSelected && !isCorrectOption) {
                        buttonStyle = "border-red-400 bg-red-50 text-red-900 cursor-default";
                        badgeStyle = "border-red-400 bg-red-400 text-white";
                      }
                    } else {
                      buttonStyle = "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 cursor-pointer";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showFeedback}
                      className={`relative rounded-xl border-2 text-left transition-all duration-200 ${isMobile ? 'p-4 text-base' : 'p-5 md:p-6 text-lg'} ${buttonStyle}`}
                    >
                      <div className="flex items-center">
                        <span className={`flex items-center justify-center rounded-full border-2 mr-3 font-bold shrink-0 transition-colors ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm mr-4'} ${badgeStyle}`}>
                          {idx + 1}
                        </span>
                        <span className={`font-medium leading-relaxed block break-words w-full ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {renderFurigana(option, handleKanjiClick)}
                        </span>
                        {showFeedback && isCorrectOption && <IconCheck className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-600 ml-auto shrink-0`} />}
                        {showFeedback && isSelected && !isCorrectOption && <IconX className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-red-600 ml-auto shrink-0`} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>

            {showFeedback && (
              <div className={`rounded-xl md:rounded-2xl border ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'} ${isAnswerCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {isAnswerCorrect ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1"><IconCheck className="w-5 h-5" /> {t.correct}</span>
                  ) : (
                    <span className="font-bold text-amber-700 flex items-center gap-1"><IconAlertCircle className="w-5 h-5" /> {t.incorrect} {currentQuestion.correctIndex + 1}.</span>
                  )}
                </div>
                <p className={`text-gray-700 leading-relaxed mt-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {currentQuestion.explanation[lang] || t.noExp}
                </p>
              </div>
            )}

            <GoogleAdBanner slotId="testing-mid-banner" />
            {isMobile && <div className="h-4"></div>}
          </main>

          <footer className={`bg-white border-t border-gray-200 sticky bottom-0 shrink-0 z-10 ${isMobile ? 'p-3 pb-6' : 'p-4'}`}>
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`rounded-lg font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-100 transition-colors ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
              >
                {t.prev}
              </button>
              {isLastQuestion ? (
                <button
                  onClick={submitTest}
                  disabled={testMode === 'learning' && !showFeedback}
                  className={`rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-transform active:scale-95 disabled:opacity-50 ${isMobile ? 'px-5 py-2 text-sm' : 'px-8 py-3 rounded-xl'}`}
                >
                  {t.finish}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={testMode === 'real' ? !hasAnsweredCurrent : !showFeedback}
                  className={`rounded-lg font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${testMode === 'learning' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} ${isMobile ? 'px-6 py-2 text-sm' : 'px-8 py-3 rounded-xl'}`}
                >
                  {t.next}
                </button>
              )}
            </div>
          </footer>
        </div>
      );
    }

    if (gameState === 'results' && results) {
      return (
        <main className={`bg-gray-50 text-gray-800 font-sans flex-1 relative ${isMobile ? 'py-6 px-3 pt-16' : 'min-h-screen py-10 px-4'}`}>
          <div className="absolute top-4 right-4 z-[60] flex items-center gap-2">
            {renderNavControls()}
          </div>
          <div className={`mx-auto ${isMobile ? 'w-full' : 'max-w-4xl'}`}>
            <div className={`bg-white shadow-lg border border-gray-100 overflow-hidden mb-8 text-center relative ${isMobile ? 'rounded-2xl p-6' : 'rounded-3xl p-10'}`}>
              {results.isPass ? (
                <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
              ) : (
                <div className="absolute top-0 left-0 w-full h-3 bg-red-500"></div>
              )}
              <div className="mb-4">
                {results.isPass ? (
                  <div className={`inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-500 mx-auto ${isMobile ? 'w-16 h-16 mb-3' : 'w-24 h-24 mb-4'}`}>
                    <IconCheck className={isMobile ? 'w-8 h-8' : 'w-12 h-12'} />
                  </div>
                ) : (
                  <div className={`inline-flex items-center justify-center rounded-full bg-red-100 text-red-500 mx-auto ${isMobile ? 'w-16 h-16 mb-3' : 'w-24 h-24 mb-4'}`}>
                    <IconX className={isMobile ? 'w-8 h-8' : 'w-12 h-12'} />
                  </div>
                )}
                <h1 className={`font-black text-gray-900 uppercase tracking-tight ${isMobile ? 'text-2xl mt-2' : 'text-4xl'}`}>
                  {results.isPass ? t.testPassed : t.testFailed}
                </h1>
                <p className={`text-gray-500 mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {t.level}: {selectedLevel} | {t.mode}: {testMode === 'learning' ? t.practice : t.real} | {t.requirement}: {currentData.passThreshold * 100}%
                </p>
              </div>
              <div className={`flex flex-col justify-center items-center my-6 ${isMobile ? 'gap-4' : 'md:flex-row gap-8 md:gap-16 my-8'}`}>
                <div className="text-center">
                  <div className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">{t.yourScore}</div>
                  <div className={`font-black text-gray-800 ${isMobile ? 'text-4xl' : 'text-5xl'}`}>
                    {results.score} <span className="text-xl text-gray-400">/ {testQuestions.length}</span>
                  </div>
                </div>
                <div className={`w-px h-16 bg-gray-200 hidden ${isMobile ? '' : 'md:block'}`}></div>
                <div className="text-center">
                  <div className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">{t.percentage}</div>
                  <div className={`font-black ${isMobile ? 'text-4xl' : 'text-5xl'} ${results.isPass ? 'text-emerald-600' : 'text-red-600'}`}>
                    {results.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className={`flex gap-3 justify-center ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <button
                  onClick={restartTest}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 ${isMobile ? 'py-3 px-6 text-sm w-full' : 'py-4 px-8'}`}
                >
                  {t.restart}
                </button>
                <button
                  onClick={goHome}
                  className={`bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 ${isMobile ? 'py-3 px-6 text-sm w-full' : 'py-4 px-8'}`}
                >
                  {t.backToStart}
                </button>
              </div>
            </div>

            <GoogleAdBanner slotId="results-banner" />

            {/* Softer donation ask on results */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-pink-700 font-bold text-sm mb-2">{t.foundHelpful}</p>
              <p className="text-pink-600 text-xs mb-3">{t.supportFree}</p>
              <a
                href="https://buymeacoffee.com/created.by"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFDD00] hover:bg-[#f3d300] text-gray-900 font-bold py-2 px-5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
              >
                {t.coffeeBtn}
              </a>
            </div>

            {/* Premium upsell on results */}
            {results && !results.isPass && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div className="flex-1">
                    <p className="font-bold text-amber-800 text-sm">{t.proTitle}</p>
                    <p className="text-amber-700 text-xs mt-1">{t.proFeature1}</p>
                  </div>
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors shrink-0"
                  >
                    {t.goPro}
                  </button>
                </div>
              </div>
            )}

            <section className={`space-y-4 ${isMobile ? 'mb-8' : 'space-y-6'}`}>
              <h2 className={`font-bold text-gray-800 px-2 ${isMobile ? 'text-lg mb-3' : 'text-2xl mb-6'}`}>{t.detailedReview}</h2>
              {testQuestions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctIndex;
                const isSkipped = userAnswer === undefined;
                return (
                  <article key={index} className={`bg-white shadow-sm border-2 overflow-hidden ${isMobile ? 'rounded-xl' : 'rounded-2xl'} ${isCorrect ? 'border-emerald-200' : 'border-red-200'}`}>
                    <header className={`px-4 py-2 flex justify-between items-center font-bold ${isMobile ? 'text-xs' : 'text-sm px-6 py-3'} ${isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      <span>{t.question} {index + 1}</span>
                      <span className="flex items-center gap-1">
                        {isCorrect ? <><IconCheck className="w-4 h-4" /> {t.correctLabel}</> : <><IconX className="w-4 h-4" /> {t.incorrectLabel}</>}
                      </span>
                    </header>
                    <div className={isMobile ? 'p-4' : 'p-6'}>
                      <h3 className={`text-gray-900 whitespace-pre-wrap font-medium leading-relaxed pb-2 ${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'}`}>
                        {renderFurigana(q.text, handleKanjiClick)}
                      </h3>
                      <div className={`grid gap-2 mb-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:gap-3'}`}>
                        {q.options.map((option, optIdx) => {
                          let bgClass = "bg-gray-50 border-gray-200 text-gray-600";
                          let icon: React.ReactNode = null;
                          if (optIdx === q.correctIndex) {
                            bgClass = "bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold";
                            icon = <IconCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
                          } else if (optIdx === userAnswer) {
                            bgClass = "bg-red-100 border-red-400 text-red-900";
                            icon = <IconX className="w-4 h-4 text-red-600 shrink-0" />;
                          }
                          return (
                            <div key={optIdx} className={`rounded-lg border-2 flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} ${bgClass}`}>
                              <div className="flex items-center gap-2">
                                <span className="opacity-70 text-xs shrink-0">{optIdx + 1}.</span>
                                <span className={`leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>{renderFurigana(option, handleKanjiClick)}</span>
                              </div>
                              {icon}
                            </div>
                          );
                        })}
                      </div>
                      {isSkipped && (
                        <p className={`text-red-500 font-medium ${isMobile ? 'mt-2 text-sm' : 'mt-4'}`}>{t.unanswered}</p>
                      )}
                      <div className={`bg-gray-50 rounded-lg border border-gray-100 ${isMobile ? 'mt-3 p-3' : 'mt-4 p-4'}`}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">{t.explanation}</h4>
                        <p className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>{q.explanation[lang]}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </main>
      );
    }
    return null;
  };

  return (
    <div className="font-sans w-full min-h-screen flex flex-col relative">
      {renderAppContent()}
      <Footer
        onPrivacy={() => setShowPrivacyModal(true)}
        onTerms={() => setShowTermsModal(true)}
        onSeller={() => setShowSellerModal(true)}
        onCookies={() => { try { localStorage.removeItem(COOKIE_KEY); } catch {} setCookieConsentGiven(false); }}
        lang={lang}
      />
      {renderKanjiModal()}
      {renderSupportModal()}
      <PremiumModal show={showPremiumModal} onClose={() => setShowPremiumModal(false)} t={t} />
      <LegalModal show={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy"><PrivacyPolicyContent /></LegalModal>
      <LegalModal show={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Service"><TermsContent /></LegalModal>
      <LegalModal show={showSellerModal} onClose={() => setShowSellerModal(false)} title="Seller Disclosure (特定商取引法)"><SellerDisclosureContent /></LegalModal>
      {!cookieConsentGiven && <CookieBanner onConsent={() => setCookieConsentGiven(true)} />}
    </div>
  );
}