import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { levelData, allLevels } from './data';
import { lookupReadings } from './data/kanjiReadings';
import type { JLPTLevel, LevelData, Lang, GameState, TestMode, KanjiEntry, Question } from './data';
import { useAuth } from './useAuth';
import { AuthModal } from './AuthModal';
import { speak, stopSpeaking, getSavedRate, saveRate, ttsSupported, hasGoodJapaneseVoice } from './tts';

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
    incorrect: "Falsch — nicht ganz",
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
    supportModalDesc: "JLPT Test Hub offers a free tier (Learning Mode + 1 Real Test trial) and an optional Pro subscription ($4.99/month) for unlimited practice. If this tool helped you prepare for your JLPT exam, consider supporting server upkeep or buying us a coffee!",
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
    proFeatures: "Unlimited Real Tests, full 30 questions, weakness analysis, weakness training, PDF export, test history, ad-free",
    proPrice: "$4.99/month or $29.99/year",
    proCTA: "Upgrade with Stripe",
    proCancel: "Maybe later",
    proFeature1: "✓ Unlimited questions per test (vs. 30 free)",
    proFeature2: "✓ Full test history & progress tracking",
    proFeature3: "✓ Schwachstellen-Analyse nach Kategorie + gezieltes Training",
    proFeature4: "✓ All 150+ official questions unlocked",
    proFeature5: "✓ PDF-Export deiner Ergebnisse mit Erklärungen",
    proFeature6: "✓ Ad-free experience",
    foundHelpful: "Found this helpful?",
    // Pro features
    srsTitle: "🔁 Spaced Review",
    srsDueDesc: "{n} questions are due for review today — reviewing them now locks them into memory",
    srsPracticeDesc: "{n} mistakes not yet scheduled — start them now and spaced repetition will schedule them automatically",
    srsStartDue: "Review {n}",
    srsStartPractice: "Practice {n}",
    srsModeBadge: "🔁 REVIEW MODE",
    srsModeHint: "Answers update your review schedule",
    srsStart: "Start Review",
    notebookTitle: "📚 Mistake Notebook",
    notebookTrain: "🎯 Practice Mistakes",
    notebookShowMore: "Show {n} more",
    notebookShowLess: "Show less",
    insightTitle: "📊 Where you stand",
    insightFocus: "Focus here — biggest gains",
    insightMid: "Getting there",
    insightStrong: "Strong — keep it up",
    insightLowData: "Not enough data yet",
    insightTip: "{cat} causes most of your mistakes ({acc}% correct). A drill targets exactly those questions.",
    catDrill: "Drill",
    supportFree: "Support free JLPT prep",
    // Profile modal
    profileSubscription: "Subscription",
    profilePro: "Pro Subscription",
    profileFree: "Free Version",
    profileRenews: "Renews",
    profileFreeDesc: "Learning Mode: 10 questions • 1 Real Test trial",
    profileCancelSoon: "Cancels at period end",
    profileLoading: "Loading progress...",
    profileProgress: "Your Progress",
    profileTests: "Tests",
    profileAccuracy: "Accuracy",
    profileCorrect: "Correct",
    profileMinutes: "Minutes",
    profileLastTests: "Recent Tests",
    profileModeReal: "Real",
    profileModeLearning: "Learn",
    profileNoTests: "No tests completed yet — start now!",
    profileNotAvailable: "Progress not available",
    profileWeaknessTitle: "🎯 Weakness Analysis",
    profileWeakBadge: "weak",
    profileWeaknessEmpty: "🎉 No weaknesses yet — take a test!",
    profileWrongCount: "× wrong",
    profileMastered: "mastered ✓",
    profileMasteredTitle: "Mark as mastered",
    profileTrain: "🎯 Train Weak Points",
    questionsShort: "questions",
    profileLocked: "🔒 Weakness Analysis",
    profileLockedDesc: "Pro feature — automatically identifies your weak spots",
    profileCancel: "Cancel Subscription (Self-Service)",
    profileUpgrade: "⭐ Upgrade to Pro —",
    profileSignOut: "Sign Out",
    profileCreated: "Created",
    profileMonthly: "Monthly",
    profileYearly: "Yearly",
    profilePerMonth: "/month",
    profileSave50: "Save 50%",
    profileRedirecting: "Redirecting to Stripe...",
    profileBackToProfile: "Back to Profile",
    profileCancelPending: "Cancellation at period end",
    ttsListen: "Listen",
    ttsPronounce: "Hear pronunciation",
    ttsSpeed: "Speech speed",
    ttsReadQuestion: "Read question aloud",
    ttsVoiceImprove: "Improve voice?",
    navSignIn: "Sign In",
    navOpenProfile: "Open Profile",
    kanjiMastered: "Mark as mastered",
    kanjiNotInDict: "Not in dictionary — readings shown as reference",
    kanjiReadings: "Readings",
    kanjiOnLabel: "音 On",
    kanjiKunLabel: "訓 Kun",
    kanjiListen: "Listen",

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
    incorrect: "Falsch — nicht ganz",
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
    supportModalDesc: "JLPT Test Hub bietet eine kostenlose Version (Lernmodus + 1 Real-Test-Trial) und ein optionales Pro-Abonnement ($4.99/Monat) für unbegrenzte Praxis. Wenn Ihnen dieses Tool bei der Vorbereitung auf Ihre JLPT-Prüfung geholfen hat, unterstützen Sie gerne die Serverkosten!",
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
    proFeatures: "Unbegrenzte Real-Tests, 30 Fragen, Schwachstellen-Analyse, Training, PDF-Export, werbefrei",
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
    // Pro-Features
    srsTitle: "🔁 Wiederholungs-Queue",
    srsDueDesc: "{n} Fragen sind heute zur Wiederholung fällig — jetzt wiederholen sichert sie ins Langzeitgedächtnis",
    srsPracticeDesc: "{n} Fehler noch nicht eingeplant — jetzt starten, die Wiederholungs-Queue plant sie automatisch",
    srsStartDue: "{n} wiederholen",
    srsStartPractice: "{n} üben",
    srsModeBadge: "🔁 WIEDERHOLUNGS-MODUS",
    srsModeHint: "Antworten aktualisieren deinen Wiederholungsplan",
    srsStart: "Wiederholen starten",
    notebookTitle: "📚 Fehlerheft",
    notebookTrain: "🎯 Fehler üben",
    notebookShowMore: "{n} mehr anzeigen",
    notebookShowLess: "Weniger anzeigen",
    insightTitle: "📊 Wo du stehst",
    insightFocus: "Hier ansetzen — größter Fortschritt",
    insightMid: "Auf dem Weg",
    insightStrong: "Stark — weiter so",
    insightLowData: "Noch zu wenige Daten",
    insightTip: "{cat} verursacht die meisten deiner Fehler ({acc}% richtig). Eine Übung trainiert genau diese Fragen.",
    catDrill: "Üben",
    supportFree: "Kostenlose JLPT-Vorbereitung unterstützen",
    // Profil-Modal
profileModeReal: "Real",
    profileWeaknessLoading: "Lade Schwachstellen-Daten…",
    profileWeakCount: "schwach",
    profileLockedTitle: "🔒 Schwachstellen-Analyse",
    navHome: "Startseite",
    navRestart: "Neu starten",
    ttsReadingOn: "On-Lesung anhören",
    ttsReadingKun: "Kun-Lesung anhören",

  }
};

interface SvgProps {
  className?: string;
}

const IconClock = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheck = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconX = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconAlertCircle = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconBookOpen = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconHeart = ({ className }: SvgProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <div className="h-12 flex items-center justify-center text-gray-600 font-mono text-xs">
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
      <p className="text-gray-600 text-[10px] mt-2 leading-relaxed">{t.affiliateDisclosure}</p>
      <p className="text-gray-600 text-[10px] mt-1 leading-relaxed">{lang === 'de' ? 'Als Amazon-Partner verdiene ich an qualifizierten Käufen.' : 'As an Amazon Associate, I earn from qualifying purchases.'}</p>
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

// Premium upgrade + profile modal
const ProfilePage = ({ onClose, nav, isMobile, t, isLoggedIn, isPro, onUpgrade, srsNewCount, onStartSrsPractice, onSignIn, onCancelSub, user, subscription, onLogout, onFetchProgress, onFetchWeakness, onMasterQuestion, lang, weaknessData, srsDueCount, notebookData, onStartSrsReview, onStartNotebookTraining, onRefreshNotebook, onExportNotebookPdf, onStartCategoryDrill, selectedLevelForDrill, onSetNotebookData }: { onClose: () => void; t: any; isLoggedIn: boolean; isPro: boolean; onUpgrade: (plan: 'monthly' | 'yearly') => Promise<void>; onSignIn: () => void; onCancelSub: () => Promise<void>; user: any; subscription: any; onLogout: () => void; onFetchProgress: () => Promise<{ stats: any; history: any[] } | null>; onFetchWeakness: () => Promise<any>; onMasterQuestion: (questionId: number, level: string) => Promise<void>; lang: string; weaknessData: any; srsDueCount: number; srsNewCount: number; onStartSrsPractice: () => Promise<void>; notebookData: any; onStartSrsReview: () => Promise<void>; onStartNotebookTraining: (pairs: Array<{ id: number; level: string }>) => void; onRefreshNotebook: () => Promise<any>; onExportNotebookPdf: () => void; onStartCategoryDrill: (level: string, category: string) => Promise<void>; selectedLevelForDrill: string; onSetNotebookData: (d: any) => void; nav: React.ReactNode; isMobile: boolean }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'profile' | 'upgrade'>('profile');
  const [progressData, setProgressData] = useState<{ stats: any; history: any[] } | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);

  const findQuestion = (qid: number, level: string) => {
    const bank = levelData[level as 'N5' | 'N4' | 'N3']?.questionBank || [];
    return bank.find((q: any) => q.id === qid) || null;
  };

  useEffect(() => {
    if (isLoggedIn && view === 'profile' && !progressData) {
      setProgressLoading(true);
      onFetchProgress().then(data => {
        setProgressData(data);
        setProgressLoading(false);
      });
    }
    if (isLoggedIn && view === 'profile' && !weaknessData) {
      onFetchWeakness();
    }
    if (isLoggedIn && isPro && !notebookData) {
      onSetNotebookData(null);
      onRefreshNotebook().then(d => { if (d) onSetNotebookData(d); });
    }
  }, [isLoggedIn, view, isPro, notebookData]);

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      onClose();
      onSignIn();
      return;
    }
    setLoading(true);
    await onUpgrade(selectedPlan);
    setLoading(false);
  };

  // PROFILE PAGE — full page for all logged-in users (free and pro)
  return (
    <main className={`bg-gray-50 text-gray-800 font-sans flex-1 relative ${isMobile ? 'min-h-full py-6 px-3 pt-16' : 'min-h-screen py-10 px-4'}`}>
      <div className="absolute top-4 right-4 z-[60] flex items-center gap-2">
        {nav}
      </div>
      <div className={`mx-auto w-full ${isMobile ? 'max-w-full' : 'max-w-3xl'}`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
              <IconBookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t.proTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
            <IconX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 md:p-8">
        {/* PROFILE VIEW */}
        {user && (
          <div className="space-y-4">
            {/* User info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-black shrink-0">
                {user.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
              {isPro && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full shrink-0">⭐ PRO</span>
              )}
            </div>

            {/* Subscription status */}
            <div className={`rounded-xl p-4 border ${isPro ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{isPro ? t.profilePro : t.profileFree}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {isPro
                      ? `${t.profileRenews} ${subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US') : 'N/A'}`
                      : t.profileFreeDesc}
                  </p>
                </div>
                {subscription?.cancelAtPeriodEnd && (
                  <span className="text-xs text-amber-600 font-bold">{t.profileCancelSoon}</span>
                )}
              </div>
            </div>

            {/* Progress Stats */}
            {progressLoading ? (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-gray-500 text-xs">{t.profileLoading}</p>
              </div>
            ) : progressData?.stats ? (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-3">{t.profileProgress}</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 text-center">
                    <div className="text-xl font-black text-emerald-700">{progressData.stats.totalTestsTaken || 0}</div>
                    <div className="text-[10px] text-gray-600">{t.profileTests}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 text-center">
                    <div className="text-xl font-black text-emerald-700">{progressData.stats.accuracy || 0}%</div>
                    <div className="text-[10px] text-gray-600">{t.profileAccuracy}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 text-center">
                    <div className="text-xl font-black text-emerald-700">{progressData.stats.totalCorrect || 0}</div>
                    <div className="text-[10px] text-gray-600">{t.profileCorrect}</div>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 text-center">
                    <div className="text-xl font-black text-emerald-700">{Math.floor((progressData.stats.totalTimeSpentSeconds || 0) / 60)}</div>
                    <div className="text-[10px] text-gray-600">{t.profileMinutes}</div>
                  </div>
                </div>
                {progressData.history.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold text-gray-700 mb-1.5">{t.profileLastTests}</h5>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {progressData.history.slice(0, 5).map((h: any) => (
                        <div key={h.id} className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-gray-100 text-xs">
                          <span className="font-bold text-gray-700">{h.level}</span>
                          <span className="text-gray-500">{h.mode === 'real' ? t.profileModeReal : t.profileModeLearning}</span>
                          <span className={`font-bold ${h.score >= 60 ? 'text-emerald-700' : 'text-red-700'}`}>{h.score}%</span>
                          <span className="text-gray-400 text-[10px]">{new Date(h.completed_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {progressData?.stats?.totalTestsTaken === 0 && (
                  <p className="text-gray-500 text-xs text-center">{t.profileNoTests}</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-gray-500 text-xs">{t.profileNotAvailable}</p>
              </div>
            )}

            {/* === PRO: SRS Review Queue === */}
            {isPro && (srsDueCount > 0 || srsNewCount > 0) && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-300 space-y-2">
                {srsDueCount > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">{t.srsTitle}</h4>
                      <p className="text-amber-700 text-xs mt-0.5">{t.srsDueDesc.replace('{n}', String(srsDueCount))}</p>
                    </div>
                    <button
                      onClick={async () => { await onStartSrsReview(); }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm shrink-0"
                    >
                      {t.srsStartDue.replace('{n}', String(srsDueCount))}
                    </button>
                  </div>
                )}
                {srsNewCount > 0 && (
                  <div className={`flex items-center justify-between gap-3 ${srsDueCount > 0 ? 'pt-2 border-t border-amber-200' : ''}`}>
                    <div>
                      {srsDueCount === 0 && <h4 className="font-bold text-amber-900 text-sm">{t.srsTitle}</h4>}
                      <p className="text-amber-700 text-xs mt-0.5">{t.srsPracticeDesc.replace('{n}', String(srsNewCount))}</p>
                    </div>
                    <button
                      onClick={async () => { await onStartSrsPractice(); }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm shrink-0"
                    >
                      {t.srsStartPractice.replace('{n}', String(Math.min(10, srsNewCount)))}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* === PRO: Mistake Notebook === */}
            {isPro ? (
              !notebookData ? (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
                  <p className="text-purple-700 text-xs">{t.profileWeaknessLoading}</p>
                </div>
              ) : (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-purple-900 text-sm">{t.notebookTitle}</h4>
                    {notebookData?.total > 0 && (
                      <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {notebookData.total}
                      </span>
                    )}
                  </div>

                  {/* Notebook empty state */}
                  {(!notebookData?.questions || notebookData.questions.length === 0) ? (
                    <p className="text-purple-700 text-xs text-center py-2">
                      {t.profileWeaknessEmpty}
                    </p>
                  ) : (
                    <>
                      {/* Actual wrong questions with explanations */}
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {notebookData.questions.slice(0, showNotebook ? 20 : 4).map((wq: any) => {
                          const q = findQuestion(wq.question_id, wq.level);
                          if (!q) return null;
                          const wrongOpt = wq.last_wrong_option !== null && wq.last_wrong_option !== undefined ? q.options[wq.last_wrong_option] : null;
                          const correctOpt = q.options[q.correctIndex];
                          return (
                            <div key={`${wq.level}-${wq.question_id}`} className="bg-white rounded-xl p-3 border border-purple-100">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  {wq.level} · {q.category} · {wq.times_wrong || wq.attempts}{t.profileWrongCount}
                                </span>
                                <button
                                  onClick={async () => {
                                    await onMasterQuestion(wq.question_id, wq.level);
                                    const fresh = await onRefreshNotebook();
                                    if (fresh) onSetNotebookData(fresh);
                                  }}
                                  className="text-purple-700 hover:text-purple-900 font-bold text-[10px] underline shrink-0"
                                  title={t.profileMasteredTitle}
                                >
                                  {t.profileMastered}
                                </button>
                              </div>
                              <p className="text-sm text-gray-900 font-medium mb-2">{q.text}</p>
                              <div className="space-y-1 text-xs">
                                {wrongOpt && (
                                  <div className="flex items-start gap-1.5 text-red-700">
                                    <span className="shrink-0">❌</span>
                                    <span>{lang === 'de' ? 'Deine Antwort:' : 'Your answer:'} <strong>{wrongOpt}</strong></span>
                                  </div>
                                )}
                                <div className="flex items-start gap-1.5 text-emerald-700">
                                  <span className="shrink-0">✓</span>
                                  <span>{lang === 'de' ? 'Richtig:' : 'Correct:'} <strong>{correctOpt}</strong></span>
                                </div>
                                <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-gray-600 leading-relaxed">
                                  {q.explanation[lang as Lang]}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => { onStartNotebookTraining(notebookData.questions.map((wq: any) => ({ id: wq.question_id, level: wq.level }))); }}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
                        >
                          {t.notebookTrain} ({Math.min(20, notebookData.questions.length)})
                        </button>
                        <button
                          onClick={() => onExportNotebookPdf()}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2.5 px-3.5 rounded-xl transition-all active:scale-95 text-sm"
                          title={lang === 'de' ? 'Als PDF exportieren' : 'Export as PDF'}
                        >
                          📄 PDF
                        </button>
                      </div>
                      {notebookData.questions.length > 4 && (
                        <button
                          onClick={() => setShowNotebook(!showNotebook)}
                          className="w-full mt-2 text-purple-700 hover:text-purple-900 font-bold text-xs underline"
                        >
                          {showNotebook ? t.notebookShowLess : t.notebookShowMore.replace('{n}', String(notebookData.questions.length - 4))}
                        </button>
                      )}
                    </>
                  )}

                  {/* Insight panel: where you stand, plain language, worst first */}
                  {(() => {
                    const cats = weaknessData?.categories || [];
                    if (!cats.length) return null;
                    const withData = cats
                      .map((c: any) => ({ ...c, accuracy: 100 - c.errorRate }))
                      .filter((c: any) => c.total >= 5)
                      .sort((a: any, b: any) => a.accuracy - b.accuracy);
                    const lowData = cats
                      .map((c: any) => ({ ...c, accuracy: 100 - c.errorRate }))
                      .filter((c: any) => c.total < 5);
                    const focus = withData.filter((c: any) => c.accuracy < 50);
                    const mid = withData.filter((c: any) => c.accuracy >= 50 && c.accuracy < 80);
                    const strong = withData.filter((c: any) => c.accuracy >= 80);
                    const topWeak = withData[0];
                    const shortName = (cat: string) => cat.replace(' & Konjugation', '').replace(' & Lesung', '').replace(' & Struktur', '').replace('Höflichkeit & Ausdruck', 'Keigo');
                    const Row = ({ c, tone }: { c: any; tone: 'red' | 'amber' | 'emerald' }) => (
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone === 'red' ? 'bg-red-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                        <span className="text-xs text-gray-700 flex-1 min-w-0 truncate" title={c.category}>{shortName(c.category)}</span>
                        <span className={`text-xs font-bold shrink-0 ${tone === 'red' ? 'text-red-700' : tone === 'amber' ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {c.accuracy}% ({c.total})
                        </span>
                        <button
                          onClick={async () => { await onStartCategoryDrill(selectedLevelForDrill, c.category); }}
                          className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-lg transition-colors shrink-0"
                        >
                          {t.catDrill}
                        </button>
                      </div>
                    );
                    return (
                      <div className="mt-4 pt-3 border-t border-purple-100">
                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{t.insightTitle}</h5>

                        {focus.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-1">{t.insightFocus}</p>
                            <div className="space-y-1.5">
                              {focus.map((c: any) => <Row key={c.category} c={c} tone="red" />)}
                            </div>
                          </div>
                        )}
                        {mid.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">{t.insightMid}</p>
                            <div className="space-y-1.5">
                              {mid.map((c: any) => <Row key={c.category} c={c} tone="amber" />)}
                            </div>
                          </div>
                        )}
                        {strong.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">{t.insightStrong}</p>
                            <div className="space-y-1.5">
                              {strong.map((c: any) => <Row key={c.category} c={c} tone="emerald" />)}
                            </div>
                          </div>
                        )}
                        {lowData.length > 0 && (
                          <p className="text-[10px] text-gray-500 mb-2">
                            {t.insightLowData}: {lowData.map((c: any) => shortName(c.category)).join(', ')}
                          </p>
                        )}

                        {topWeak && topWeak.accuracy < 80 && (
                          <div className="mt-3 bg-purple-100 rounded-lg p-2.5">
                            <p className="text-[11px] text-purple-900 leading-relaxed">
                              💡 {t.insightTip.replace('{cat}', shortName(topWeak.category)).replace('{acc}', String(topWeak.accuracy))}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
              )
            ) : (
              /* Locked preview for free users */
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 relative overflow-hidden">
                <div className="filter blur-sm select-none pointer-events-none space-y-2" aria-hidden="true">
                  <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-purple-100 rounded w-full"></div>
                  <div className="h-2.5 bg-purple-100 rounded w-5/6"></div>
                  <div className="h-2.5 bg-purple-100 rounded w-2/3"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-purple-900 font-bold text-sm">{t.profileLockedTitle}</p>
                  <p className="text-purple-700 text-xs mt-1">{t.profileLockedDesc}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {isPro ? (
                <button
                  onClick={async () => { await onCancelSub(); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded-xl border border-red-200 transition-all active:scale-95 text-sm"
                >
                  {t.profileCancel}
                </button>
              ) : (
                <button
                  onClick={() => setView('upgrade')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
                >
                  {t.profileUpgrade} {t.proCTA}
                </button>
              )}
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 text-sm"
              >
                {t.profileSignOut}
              </button>
            </div>

            {/* Account info */}
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
              <p><strong>E-Mail:</strong> {user.email}</p>
              <p><strong>{t.profileCreated}:</strong> {new Date(user.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</p>
            </div>

            <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs transition-colors">
              {t.proCancel}
            </button>
          </div>
        )}
        {!user && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-sm mb-4">{lang === 'de' ? 'Melde dich an, um dein Profil, deinen Fortschritt und dein Fehlerheft zu sehen.' : 'Sign in to see your profile, progress, and mistake notebook.'}</p>
            <button
              onClick={() => { onClose(); onSignIn(); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
            >
              {t.navSignIn}
            </button>
          </div>
        )}

        {/* UPGRADE VIEW — shown when free user clicks upgrade */}
        {view === 'upgrade' && (
          <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">{t.proTitle}</h3>
                <button onClick={() => setView('profile')} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                  <IconX className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${selectedPlan === 'monthly' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                >
                  <div className="text-xs text-gray-500">{t.profileMonthly}</div>
                  <div className="text-xl font-black text-gray-900">$4.99</div>
                  <div className="text-xs text-gray-600">{t.profilePerMonth}</div>
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${selectedPlan === 'yearly' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                >
                  <div className="text-xs text-gray-500">{t.profileYearly}</div>
                  <div className="text-xl font-black text-gray-900">$29.99</div>
                  <div className="text-xs text-emerald-700 font-bold">{t.profileSave50}</div>
                </button>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm disabled:opacity-50"
              >
                {loading ? t.profileRedirecting : t.proCTA}
              </button>
              <div className="text-center text-xs text-gray-600 mt-2">{t.proPrice}</div>
              <button onClick={() => setView('profile')} className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs transition-colors">
                {t.profileBackToProfile}
              </button>
          </div>
        )}
        </div>
      </div>
      </div>
    </main>
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
const CookieBanner = ({ onConsent, onOpenPrivacy }: { onConsent: () => void; onOpenPrivacy: () => void }) => {
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
              <span className="ml-2 text-gray-400">We use essential cookies for the app to work. With your consent, we also use advertising (Google AdSense) and affiliate tracking cookies. See our <button onClick={onOpenPrivacy} className="underline text-emerald-400 hover:text-emerald-300">Privacy Policy</button>.</span>
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

// Impressum (§5 DDG — required for German-based operators)
const ImpressumContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">Angaben gemäß §§ 5, 6 DDG (Digitale-Dienste-Gesetz)</h3>
    <div className="space-y-3">
      <div>
        <p><strong>Diensteanbieter:</strong></p>
        <p>[YOUR NAME]</p>
        <p>[YOUR STREET ADDRESS]</p>
        <p>[YOUR POSTAL CODE] [YOUR CITY]</p>
        <p>Germany</p>
      </div>
      <div>
        <p><strong>Kontakt:</strong></p>
        <p>E-Mail: createdby.jp@gmail.com</p>
        <p>Telefon: [YOUR PHONE]</p>
      </div>
      <div>
        <p><strong>Umsatzsteuer-Identifikationsnummer:</strong></p>
        <p>Kleinunternehmer gemäß § 19 UStG — umsatzsteuerbefreit.</p>
      </div>
      <div>
        <p><strong>Verantwortlich für den Inhalt:</strong></p>
        <p>[YOUR NAME], [YOUR ADDRESS]</p>
      </div>
      <div>
        <p><strong>Streitschlichtung:</strong></p>
        <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">https://ec.europa.eu/consumers/odr/</a>. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
      <div>
        <p><strong>Haftung für Inhalte:</strong></p>
        <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      </div>
      <div>
        <p><strong>Haftung für Links:</strong></p>
        <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      </div>
      <div>
        <p><strong>Urheberrecht:</strong></p>
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. JLPT-Fragen stammen aus dem offiziellen JLPT Practice Workbook der Japan Foundation und JEES.</p>
      </div>
    </div>
    <p className="text-xs text-gray-600 mt-4 italic">※ Ersetzen Sie die Platzhalter [YOUR NAME], [YOUR ADDRESS] etc. mit Ihren echten Daten, bevor die Website live geht.</p>
  </>
);

// Privacy Policy content (DSGVO/GDPR + TTDSG compliant for Germany)
// Datenschutzerklärung (DSGVO/GDPR + TTDSG — vollständig, Befunde F-03 bis F-08, F-13, F-14, F-15, F-17, F-18 behoben)
const PrivacyPolicyContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">Datenschutzerklärung</h3>
    <p className="text-xs text-gray-600">Zuletzt aktualisiert: 27. September 2026</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">1. Verantwortlicher</h3>
    <p>Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) für die Datenverarbeitung auf dieser Website:</p>
    <p className="mt-2 bg-gray-50 p-3 rounded-lg"><strong>[YOUR NAME]</strong><br/>[YOUR STREET ADDRESS]<br/>[YOUR POSTAL CODE] [YOUR CITY]<br/>Germany<br/>E-Mail: createdby.jp@gmail.com<br/>Telefon: [YOUR PHONE]</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">2. Verarbeitungszwecke und Rechtsgrundlagen</h3>
    <p>Wir verarbeiten personenbezogene Daten zu folgenden Zwecken:</p>
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-xs border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold border-b">Zweck</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Daten</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Rechtsgrundlage</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Speicherdauer</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-3 py-2">Kontoverwaltung (Registrierung, Login, Profil)</td>
            <td className="px-3 py-2">E-Mail, Name, Passwort-Hash (PBKDF2)</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td>
            <td className="px-3 py-2">Bis zur Kontolöschung</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Speicherung von Testergebnissen</td>
            <td className="px-3 py-2">Level, Modus, Score, Antworten, Zeitstempel</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td>
            <td className="px-3 py-2">Bis zur Kontolöschung</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Passwort-Zurücksetzung</td>
            <td className="px-3 py-2">E-Mail, Reset-Token</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO</td>
            <td className="px-3 py-2">1 Stunde (Token-Ablauf)</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Zahlungsabwicklung (Pro-Abonnement)</td>
            <td className="px-3 py-2">Stripe Customer ID, Abo-Status</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO</td>
            <td className="px-3 py-2">Bis zur Kontolöschung / Abo-Ende</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Werbung (Google AdSense)</td>
            <td className="px-3 py-2">Cookie-IDs, IP-Adresse, Browsing-Daten</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td>
            <td className="px-3 py-2">Google-Richtlinie (max. 24 Monate)</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Affiliate-Tracking</td>
            <td className="px-3 py-2">Affiliate-Cookie, Click-ID</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td>
            <td className="px-3 py-2">Amazon: 24 Monate, JPod101: variabel</td>
          </tr>
          <tr>
            <td className="px-3 py-2">E-Mail-Versand (Kontobestätigung, Passwort-Reset)</td>
            <td className="px-3 py-2">E-Mail-Adresse</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. b DSGVO</td>
            <td className="px-3 py-2">Bis Aktion abgeschlossen</td>
          </tr>
          <tr>
            <td className="px-3 py-2">Sicherheit (Rate-Limiting, Missbrauchsschutz)</td>
            <td className="px-3 py-2">IP-Adresse (temporär, in KV-Store)</td>
            <td className="px-3 py-2">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
            <td className="px-3 py-2">1 Stunde</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="font-bold text-gray-800 text-base mt-4">3. Cookies (§ 25 Abs. 1 TTDSG)</h3>
    <p>Wir verwenden nur <strong>essentielle Cookies</strong> (Consent-Banner-Einstellung, Session-Token). Diese sind technisch erforderlich. Weitere Cookies werden <strong>nach Ihrer ausdrücklichen Einwilligung</strong> gesetzt (§ 25 Abs. 1 TTDSG). Sie können Ihre Einwilligung jederzeit widerrufen über „Cookie-Einstellungen" im Footer. Ohne Einwilligung werden keine Werbe- oder Tracking-Cookies gesetzt.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">4. Datenweitergabe an Dritte (Art. 6 Abs. 1, Art. 28 DSGVO)</h3>
    <p>Wir geben personenbezogene Daten an folgende Auftragsverarbeiter und Dritte weiter:</p>
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-xs border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold border-b">Anbieter</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Kategorie</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Zweck</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Daten</th>
            <th className="px-3 py-2 text-left font-semibold border-b">Übertragungs-Garantie</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-3 py-2"><strong>Cloudflare, Inc.</strong> (USA/EU)</td>
            <td className="px-3 py-2">Hosting, CDN, Datenbank</td>
            <td className="px-3 py-2">Website-Betrieb, Datenspeicherung</td>
            <td className="px-3 py-2">E-Mail, Name, Testergebnisse, IP-Adresse</td>
            <td className="px-3 py-2">EU-Region (WEUR), EU-US Data Privacy Framework (DPF) zertifiziert</td>
          </tr>
          <tr>
            <td className="px-3 py-2"><strong>Google Ireland Ltd.</strong> (Irland)</td>
            <td className="px-3 py-2">Werbung (AdSense)</td>
            <td className="px-3 py-2">Anzeigen-Rendering, Personalisierung (mit Einwilligung)</td>
            <td className="px-3 py-2">Cookie-IDs, IP-Adresse, Browsing-Daten</td>
            <td className="px-3 py-2">EU-Domäne (google.com/privacy), Standardvertragsklauseln (SCC)</td>
          </tr>
          <tr>
            <td className="px-3 py-2"><strong>Amazon Associates</strong> (DE/USA)</td>
            <td className="px-3 py-2">Affiliate-Marketing</td>
            <td className="px-3 py-2">Provisions-Tracking (mit Einwilligung)</td>
            <td className="px-3 py-2">Affiliate-Cookie, Click-ID</td>
            <td className="px-3 py-2">Amazon EU S.à r.l. (Luxemburg), SCC</td>
          </tr>
          <tr>
            <td className="px-3 py-2"><strong>Stripe Payments Europe Ltd.</strong> (Irland)</td>
            <td className="px-3 py-2">Zahlungsabwicklung</td>
            <td className="px-3 py-2">Pro-Abonnement-Zahlungen</td>
            <td className="px-3 py-2">E-Mail, Zahlungsinformationen (von Stripe direkt verarbeitet)</td>
            <td className="px-3 py-2">EU-Server, PCI-DSS Level 1 zertifiziert</td>
          </tr>
          <tr>
            <td className="px-3 py-2"><strong>Innovative Language Learning</strong> (Japan/USA)</td>
            <td className="px-3 py-2">Affiliate-Marketing</td>
            <td className="px-3 py-2">Provisions-Tracking (mit Einwilligung)</td>
            <td className="px-3 py-2">Affiliate-Cookie</td>
            <td className="px-3 py-2">Standardvertragsklauseln (SCC)</td>
          </tr>
          <tr>
            <td className="px-3 py-2"><strong>Buy Me a Coffee</strong> (USA)</td>
            <td className="px-3 py-2">Spenden-Abwicklung</td>
            <td className="px-3 py-2">Freiwillige Spenden</td>
            <td className="px-3 py-2">Zahlungsinformationen (direkt verarbeitet)</td>
            <td className="px-3 py-2">EU-US Data Privacy Framework (DPF) zertifiziert</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="mt-2 text-xs text-gray-500">Eine Datenübertragung in Drittländer (USA, Japan) erfolgt auf Grundlage des EU-US Data Privacy Framework (DPF) bzw. von Standardvertragsklauseln (SCC) gemäß Art. 46 DSGVO. Alle genannten Anbieter bieten angemessene Garantien für den Schutz Ihrer Daten.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">5. Server-Standort</h3>
    <p>Unsere Server stehen in der EU (Cloudflare, West-Europa Region „WEUR"). Nutzerdaten werden in einer Cloudflare D1 Datenbank in der EU gespeichert. Es findet keine Übertragung in Drittländer ohne angemessene Garantien statt.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">6. Ihre Rechte (Art. 15–21 DSGVO)</h3>
    <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO) — Sie können Auskunft über die von uns verarbeiteten Daten verlangen.</li>
      <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) — Sie können die Korrektur unrichtiger Daten verlangen.</li>
      <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO) — Sie können die Löschung Ihrer Daten verlangen („Recht auf Vergessenwerden").</li>
      <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO).</li>
      <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO) — Sie können Ihre Daten in einem maschinenlesbaren Format erhalten.</li>
      <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) — Sie können der Verarbeitung widersprechen.</li>
      <li><strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) — Ihre Einwilligung können Sie jederzeit ohne Angabe von Gründen widerrufen, mit Wirkung für die Zukunft.</li>
    </ul>
    <p className="mt-2">Zur Ausübung dieser Rechte senden Sie eine E-Mail an <strong>createdby.jp@gmail.com</strong> oder schreiben Sie an: [YOUR NAME], [YOUR ADDRESS]. Wir antworten innerhalb von 30 Tagen.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">7. Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</h3>
    <p>Sie können Ihre Einwilligung zur Cookie-Nutzung jederzeit widerrufen:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Klicken Sie auf „Cookie-Einstellungen" im Footer der Website, oder</li>
      <li>löschen Sie die Cookies in Ihrem Browser und laden Sie die Seite neu.</li>
    </ul>
    <p>Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt (Art. 7 Abs. 3 Satz 3 DSGVO).</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">8. Speicherdauer</h3>
    <p>Die Speicherdauer richtet sich nach dem jeweiligen Verarbeitungszweck (siehe Tabelle in Abschnitt 2). Nach Wegfall des Zwecks bzw. Ablauf der Speicherdauer werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen. Kontodaten und Testergebnisse werden bis zur Kontolöschung gespeichert. Sie können die Löschung jederzeit über die Kontoeinstellungen oder per E-Mail beantragen.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">9. Keine Datenschutzbeauftragten erforderlich</h3>
    <p>Da wir <strong>keine umfangreiche automatisierte Verarbeitung</strong> betreiben und weniger als 20 Personen regelmäßig mit der Verarbeitung befasst sind, ist die Benennung eines Datenschutzbeauftragten gemäß Art. 37 DSGVO nicht erforderlich.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">10. Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO)</h3>
    <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist die Aufsichtsbehörde des Bundeslandes, in dem Sie wohnen, oder:</p>
    <p className="mt-2 bg-gray-50 p-3 rounded-lg">Der Baden-Württembergische Datenschutzbeauftragte<br/>Lakhmir Singh, Postfach 10 29 32, 70018 Stuttgart<br/>Tel: +49 711 66991-0<br/>E-Mail: poststelle@lfd.baden-wuerttemberg.de</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">11. Datensicherheit</h3>
    <p>Wir treffen folgende technische und organisatorische Maßnahmen (Art. 32 DSGVO): TLS/HTTPS-Verschlüsselung für alle Verbindungen, Passwörter werden mit PBKDF2 (100.000 Iterationen, SHA-256) gehasht, JWT-Tokens mit HTTP-Only Secure Cookies, Rate-Limiting gegen Brute-Force-Angriffe, D1-Datenbank in EU-Rechenzentren.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">12. Änderungen</h3>
    <p>Wir können diese Datenschutzerklärung aktualisieren. Das „Zuletzt aktualisiert"-Datum oben zeigt die letzte Änderung. Änderungen werden auf dieser Seite veröffentlicht.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">13. Kontakt für Datenschutzanfragen</h3>
    <p>Für Datenschutzanfragen (Auskunft, Löschung, Berichtigung usw.):</p>
    <p className="mt-2 bg-gray-50 p-3 rounded-lg"><strong>E-Mail:</strong> createdby.jp@gmail.com<br/><strong>Post:</strong> [YOUR NAME], [YOUR ADDRESS]</p>
  </>
);

// Terms of Service content (German law compliant)
const TermsContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">Allgemeine Geschäftsbedingungen (AGB)</h3>

    <h3 className="font-bold text-gray-800 text-base mt-4">1. Geltungsbereich</h3>
    <p>Diese AGB gelten für die Nutzung von JLPT Test Hub (jlpttesthub.com). Durch die Nutzung stimmen Sie diesen Bedingungen zu.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">2. Leistungsbeschreibung</h3>
    <p>JLPT Test Hub bietet kostenlose JLPT-Übungstests für die Level N5, N4 und N3 mit offiziellen Prüfungsfragen, einem interaktiven Furigana-Wörterbuch und zeitgesteuerten Simulationen.</p>
    <p><strong>Kostenlose Version:</strong> Lernmodus (10 Fragen pro Test), Furigana-Wörterbuch, 1 kostenloses Real-Test-Trial. Keine Registrierung erforderlich.</p>
    <p><strong>Pro-Abonnement:</strong> $4.99/Monat oder $29.99/Jahr über Stripe. Enthält: Unbegrenzte Real-Tests, volle 30 Fragen pro Test, werbefrei, Test-Verlauf.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">3. Widerrufsrecht (§ 355 BGB)</h3>
    <p>Verbraucher haben ein 14-tägiges Widerrufsrecht bei Pro-Abonnements. Zur Ausübung kontaktieren Sie uns unter createdby.jp@gmail.com. Das Widerrufsrecht erlischt vorzeitig, wenn Sie die Pro-Funktionen während der Widerrufsfrist vollständig nutzen.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">4. Kündigung</h3>
    <p>Pro-Abonnements können jederzeit gekündigt werden. Die Kündigung wird am Ende der Abrechnungsperiode wirksam. Die Nutzung der kostenlosen Version ist davon nicht betroffen.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">5. Gewährleistung</h3>
    <p>Dieser Dienst wird "wie besehen" ohne Gewährleistung bereitgestellt. Wir übernehmen keine Haftung für die Richtigkeit der Prüfungsergebnisse oder für Serverausfälle.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">6. Haftungsausschluss</h3>
    <p>Dies ist ein inoffizielles Übungstool und steht in keiner Verbindung mit der Japan Foundation oder JEES. Übungsergebnisse garantieren keine tatsächlichen JLPT-Prüfungsergebnisse.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">7. Urheberrecht</h3>
    <p>JLPT-Fragen stammen aus dem offiziellen JLPT Practice Workbook der Japan Foundation und JEES. Die App-Oberfläche und der Code sind unser geistiges Eigentum.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">8. Anwendbares Recht</h3>
    <p>Es gilt deutsches Recht. Gerichtsstand ist [YOUR CITY], soweit gesetzlich zulässig.</p>
  </>
);

// Seller disclosure (for both Germany and future Japan)
const SellerDisclosureContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">Anbieterkennzeichnung</h3>
    <div className="space-y-3">
      <p><strong>Anbieter:</strong> [YOUR NAME]</p>
      <p><strong>Adresse:</strong> [YOUR STREET ADDRESS], [YOUR POSTAL CODE] [YOUR CITY], Germany</p>
      <p><strong>E-Mail:</strong> createdby.jp@gmail.com</p>
      <p><strong>Telefon:</strong> [YOUR PHONE]</p>
      <p><strong>USt-IdNr.:</strong> Kleinunternehmer gemäß § 19 UStG</p>
      <p><strong>Zahlungsarten:</strong> Stripe (Kreditkarte), Buy Me a Coffee</p>
      <p><strong>Preise:</strong> Kostenlos (Basis), $4.99/Monat oder $29.99/Jahr (Pro)</p>
      <p><strong>Widerruf:</strong> 14 Tage (siehe AGB)</p>
      <p><strong>Gerichtsstand:</strong> [YOUR CITY], Germany</p>
    </div>
    <p className="text-xs text-gray-600 mt-4 italic">※ Nach Umzug nach Japan: 特定商取引法表示 hinzufügen mit japanischer Adresse.</p>
  </>
);


// Barrierefreiheitserklärung (BGG / WCAG 2.2 AA — F-01, F-02 behoben)
const AccessibilityContent = () => (
  <>
    <h3 className="font-bold text-gray-800 text-base">Barrierefreiheitserklärung</h3>
    <p className="text-xs text-gray-600">Stand: 27. September 2026</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">1. Einleitung</h3>
    <p>JLPT Test Hub ist bestrebt, seine Website gemäß der Richtlinie (EU) 2016/2102 und den Behindertengleichstellungsgesetzen (BGG) barrierefrei zu gestalten. Diese Erklärung gilt für jlpttesthub.com.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">2. Konformitätsstatus</h3>
    <p>Diese Website ist <strong>teilweise konform</strong> mit WCAG 2.2 Level AA. Das bedeutet, dass die meisten Inhalte den Standards entsprechen, aber es gibt noch einige Bereiche, die verbessert werden müssen (siehe unten).</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">3. Nicht barrierefreie Inhalte</h3>
    <p>Folgende Inhalte sind aufgrund der Unverhältnismäßigkeit nach Art. 5 Abs. 3 BGG derzeit nicht vollständig barrierefrei:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Einige Textelemente haben unzureichenden Farbkontrast (WCAG 1.4.3 — Mindestkontrast 4.5:1). Wir arbeiten daran, die Kontrastverhältnisse in allen UI-Elementen zu verbessern.</li>
      <li>Japanische Schriftzeichen (Kanji) mit Furigana-Anzeige nutzen HTML-<code>&lt;ruby&gt;</code>-Elemente, die von einigen Screenreadern möglicherweise nicht optimal vorgelesen werden.</li>
    </ul>

    <h3 className="font-bold text-gray-800 text-base mt-4">4. Umgesetzte Maßnahmen</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Responsive Design, das sich an verschiedene Bildschirmgrößen anpasst</li>
      <li>Verwendung von semantischem HTML (header, main, footer, nav, article)</li>
      <li>ARIA-Labels für interaktive Elemente (Navigation, Buttons)</li>
      <li>Tastaturnavigierbare Buttons und Formulare</li>
      <li>Keine automatische Audio-/Video-Wiedergabe</li>
      <li>Keine zeitbeschränkten Interaktionen außerhalb der Test-Modi (der Timer ist ein bewusstes Prüfungsdesign-Element)</li>
      <li>Semantische Formular-Labels (label/for-Verbindungen)</li>
      <li>Fokus-Indikatoren auf interaktiven Elementen (focus:ring-2)</li>
    </ul>

    <h3 className="font-bold text-gray-800 text-base mt-4">5. Feedback-Mechanismus</h3>
    <p>Sie können uns auf Barrieren auf dieser Website melden — per E-Mail oder über unser Kontaktformular:</p>
    <div className="mt-2 bg-gray-50 p-4 rounded-lg space-y-2">
      <p>
        <a href="mailto:createdby.jp@gmail.com?subject=Barrierefreiheit: Meldung auf jlpttesthub.com" className="text-emerald-700 underline font-bold hover:text-emerald-800">
          createdby.jp@gmail.com
        </a>
        {' '}— Klicken Sie hier, um direkt eine E-Mail zu öffnen
      </p>
      <p><strong>Post:</strong> [YOUR NAME], [YOUR ADDRESS]</p>
    </div>
    <p className="mt-2">Wir bemühen uns, Anfragen innerhalb von <strong>5 Werktagen</strong> zu beantworten. Die Meldungen werden von [YOUR NAME] bearbeitet.</p>

    <h3 className="font-bold text-gray-800 text-base mt-4">6. Erstellt am / Überprüft am</h3>
    <p>Diese Erklärung wurde am 27. September 2026 erstellt und basiert auf einer Selbstbewertung. Die Website wurde zuletzt am 27. September 2026 überprüft.</p>
  </>
);

// Footer with legal links — WCAG 2.5.8 target size: min 24×24px hit area
const Footer = ({ onPrivacy, onTerms, onSeller, onCookies, onImpressum, onAccessibility }: { onPrivacy: () => void; onTerms: () => void; onSeller: () => void; onCookies: () => void; onImpressum: () => void; onAccessibility: () => void; lang: string }) => {
  const footerLink = "inline-flex items-center min-h-[24px] px-1 hover:text-emerald-400 transition-colors";
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-4 mt-8 shrink-0">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-xs">
          <a href="#impressum" onClick={(e) => { e.preventDefault(); onImpressum(); }} className={footerLink + " font-bold"}>Impressum</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <a href="#datenschutz" onClick={(e) => { e.preventDefault(); onPrivacy(); }} className={footerLink}>Datenschutz</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <a href="#agb" onClick={(e) => { e.preventDefault(); onTerms(); }} className={footerLink}>AGB — Terms &amp; Conditions</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <a href="#anbieterkennzeichnung" onClick={(e) => { e.preventDefault(); onSeller(); }} className={footerLink}>Anbieterkennzeichnung</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <a href="#barrierefreiheit" onClick={(e) => { e.preventDefault(); onAccessibility(); }} className={footerLink}>Barrierefreiheit</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <a href="mailto:createdby.jp@gmail.com?subject=Barrierefreiheit: Meldung" className={footerLink + " text-emerald-400"}>Barrierefreiheit melden</a>
          <span className="text-gray-600 px-0.5 self-center">·</span>
          <button onClick={onCookies} className={footerLink}>Cookie-Einstellungen</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">© {new Date().getFullYear()} JLPT Test Hub. Not affiliated with the Japan Foundation or JEES. JLPT is a registered trademark.</p>
      </div>
    </footer>
  );
};

const renderFurigana = (text: string, onKanjiClick?: (kanji: string, furigana: string) => void, showFurigana: boolean = true) => {
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
            {showFurigana && <rt className="text-[0.6em] text-emerald-700 font-normal select-none leading-none">{furigana}</rt>}
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

const MAINTENANCE_MODE = false;

export default function App() {
  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-700 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Under Maintenance</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            JLPT Test Hub is currently undergoing maintenance to bring you a better experience.
            We'll be back shortly!
          </p>
          <p className="text-gray-600 text-xs">— The JLPT Test Hub Team</p>
        </div>
      </div>
    );
  }

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
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [cookieConsentGiven, setCookieConsentGiven] = useState(() => !!getConsent());
  const [lang, setLang] = useState<Lang>('en');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [weaknessData, setWeaknessData] = useState<any>(null);
  const [notebookData, setNotebookData] = useState<any>(null);
  const [srsDueCount, setSrsDueCount] = useState(0);
  const [srsNewCount, setSrsNewCount] = useState(0);
  const [ttsRate, setTtsRate] = useState(() => getSavedRate());
  const [showVoiceHint, setShowVoiceHint] = useState(() => {
    try { return localStorage.getItem('jlpt-voice-hint-dismissed') !== 'true'; } catch { return true; }
  });

  const auth = useAuth();

  // Ad banner that hides for Pro users
  const AdBanner = ({ slotId }: { slotId: string }) => {
    if (auth.isPro) return null;
    return <GoogleAdBanner slotId={slotId} />;
  };

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

  // Flush offline-queued test results whenever a user is logged in (app load, after login/signup)
  useEffect(() => {
    if (auth.isLoggedIn) {
      auth.flushQueuedResults().then(n => {
        if (n > 0) setQueuedFlushed(n);
        setTimeout(() => setQueuedFlushed(0), 6000);
      });
    }
  }, [auth.isLoggedIn]);

  // Pro data: fetch weakness summary + SRS due count when a Pro user logs in
  useEffect(() => {
    if (auth.isLoggedIn && auth.isPro) {
      auth.fetchWeaknessSummary().then(d => { if (d) setWeaknessData(d); });
      auth.fetchSrsDue().then(d => {
        setSrsDueCount(d?.due?.length || 0);
        setSrsNewCount(d?.newCards?.length || 0);
      });
    } else if (!auth.isLoggedIn) {
      setWeaknessData(null);
      setNotebookData(null);
      setSrsDueCount(0);
    }
  }, [auth.isLoggedIn, auth.isPro]);

  const currentData: LevelData = levelData[selectedLevel];
  const t = uiTranslations[lang];

  // Merged kanji/word dictionary across ALL levels — a word taught in N4 must resolve
  // even when clicked during an N5 test (words appear in questions before their "home" level).
  const mergedDictionary = useMemo(() => {
    const merged: Record<string, any> = {};
    for (const lvl of ['N5', 'N4', 'N3'] as const) {
      Object.assign(merged, levelData[lvl].kanjiDictionary);
    }
    return merged;
  }, []);

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
    // Real Test mode: 1 free trial, then requires Pro
    if (mode === 'real' && !auth.isPro) {
      let trialUsed = false;
      try { trialUsed = localStorage.getItem('jlpt-real-trial-used') === 'true'; } catch {}
      if (trialUsed) {
        setGameState('profile');
        return;
      }
      // Mark trial as used
      try { localStorage.setItem('jlpt-real-trial-used', 'true'); } catch {}
    }
    setTestMode(mode);
    setSrsReviewActive(false);
    // Free users get 10 questions, Pro gets full set
    const questionCount = auth.isPro ? currentData.questionsPerTest : Math.min(10, currentData.questionsPerTest);
    const selected = shuffleArray(currentData.questionBank).slice(0, questionCount);
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

  // Launch a drill test from specific question IDs (mistake notebook / category drill / SRS)
  const startDrillFromIds = (ids: Array<number | { id: number; level: string }>, mode: 'learning' | 'real' = 'learning') => {
    if (!ids.length) return;
    const allBanks = [...levelData['N5'].questionBank.map((q: any) => ({ ...q, level: 'N5' as const })), ...levelData['N4'].questionBank.map((q: any) => ({ ...q, level: 'N4' as const })), ...levelData['N3'].questionBank.map((q: any) => ({ ...q, level: 'N3' as const }))];
    let picked: any[];
    if (typeof ids[0] === 'object') {
      // Level-qualified pairs: match exact (id, level)
      const pairSet = new Set((ids as any[]).map(p => `${p.level}-${p.id}`));
      picked = allBanks.filter((q: any) => pairSet.has(`${q.level}-${q.id}`));
    } else {
      const idSet = new Set(ids as number[]);
      picked = allBanks.filter((q: any) => idSet.has(q.id));
    }
    if (picked.length === 0) return;
    setTestMode(mode);
    setTestQuestions(shuffleArray(picked).slice(0, Math.min(20, picked.length)));
    setAnswers({});
    setCurrentQuestionIndex(0);
    setLearningAnswerRevealed(false);
    setTimeRemaining(0);
    setGameState('testing');
  };

  // Feat 2: Category drill — prioritize questions the user got wrong, fill up with unseen
  const startCategoryDrill = async (level: string, category: string) => {
    const bank = levelData[level as 'N5' | 'N4' | 'N3']?.questionBank || [];
    const inCategory = bank.filter((q: any) => q.category === category);
    if (!inCategory.length) return;
    setSrsReviewActive(true);
    let ids: number[] = inCategory.map((q: any) => q.id);
    if (auth.isPro) {
      const drill = await auth.fetchDrillQuestions(level, category);
      if (drill?.answeredWrong?.length) {
        const wrongIds = drill.answeredWrong.filter((id: number) => idSetHas(inCategory, id));
        const rest = ids.filter(id => !wrongIds.includes(id));
        ids = [...wrongIds, ...rest];
      }
    }
    startDrillFromIds(ids.slice(0, 10));
  };

  const idSetHas = (bank: any[], id: number) => bank.some((q: any) => q.id === id);

  // Find a question across all levels (for Mistake Notebook display)
  const findQuestion = (qid: number, level: string) => {
    const bank = levelData[level as 'N5' | 'N4' | 'N3']?.questionBank || [];
    return bank.find((q: any) => q.id === qid) || null;
  };

  // Feat 5: PDF export of Mistake Notebook
  const exportNotebookPdf = () => {
    if (!notebookData?.questions?.length) return;
    setPrintMode('notebook');
    setTimeout(() => { window.print(); }, 100);
  };

  const [printMode, setPrintMode] = useState<'test' | 'notebook'>('test');

  // Feat 3: SRS review session — due cards first, then new cards
  const startSrsReview = async () => {
    const data = await auth.fetchSrsDue();
    if (!data) return;
    const dueIds = data.due?.map((q: any) => ({ id: q.question_id, level: q.level })) || [];
    const newIds = data.newCards?.map((q: any) => ({ id: q.question_id, level: q.level })) || [];
    const ids = [...dueIds, ...newIds].slice(0, 15);
    if (!ids.length) return;
    // Remember mode for SRS answer recording
    setTestMode('learning');
    setSrsReviewActive(true);
    startDrillFromIds(ids);
  };

  const startSrsPractice = async () => {
    const data = await auth.fetchSrsDue();
    if (!data) return;
    const newIds = data.newCards?.map((q: any) => ({ id: q.question_id, level: q.level })) || [];
    if (!newIds.length) return;
    setTestMode('learning');
    setSrsReviewActive(true);
    startDrillFromIds(newIds.slice(0, 10));
  };

  const [srsReviewActive, setSrsReviewActive] = useState(false);
  const [queuedFlushed, setQueuedFlushed] = useState(0);

  const goHome = () => {
    setGameState('intro');
  };

  const submitTest = useCallback(() => {
    // Always save: logged-in users hit the server (auto-retry), guests queue locally
    // until signup/login, then the queue flushes with the account attached.
    if (testQuestions.length > 0) {
      let score = 0;
      testQuestions.forEach((q, index) => {
        if (answers[index] === q.correctIndex) score++;
      });
      const percentage = Math.round((score / testQuestions.length) * 100);
      const timeSpent = testMode === 'real' ? (currentData.timeMinutes * 60 - timeRemaining) : 0;

      const questionResults = testQuestions.map((q, index) => ({
        questionId: q.id,
        correct: answers[index] === q.correctIndex,
        category: q.category,
        selectedOption: answers[index] !== undefined ? answers[index] : undefined,
      }));

      auth.saveTestResult({
        level: selectedLevel,
        mode: testMode,
        score: percentage,
        correctCount: score,
        totalQuestions: testQuestions.length,
        timeSpent,
        answers,
        questionResults,
      });

      // SRS review session: record each answer to the SM-2 scheduler
      if (srsReviewActive && auth.isLoggedIn) {
        questionResults.forEach(qr => {
          // Resolve the actual level of this question (drills may span levels)
          const q = testQuestions.find(tq => tq.id === qr.questionId) as any;
          const qLevel = q?.level || selectedLevel;
          auth.submitSrsAnswer(qr.questionId, qLevel, qr.correct);
        });
        setSrsReviewActive(false);
        // Refresh due count after reviews
        setTimeout(async () => {
          const due = await auth.fetchSrsDue();
          setSrsDueCount(due?.due?.length || 0);
          setSrsNewCount(due?.newCards?.length || 0);
        }, 1500);
      }
    }
    setGameState('results');
  }, [auth.isLoggedIn, auth.saveTestResult, srsReviewActive, testQuestions, answers, testMode, selectedLevel, currentData.timeMinutes, timeRemaining]);

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
    stopSpeaking();
    if (currentQuestionIndex < testQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setLearningAnswerRevealed(testMode === 'learning' && answers[nextIdx] !== undefined);
    }
  };

  const prevQuestion = () => {
    stopSpeaking();
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setLearningAnswerRevealed(testMode === 'learning' && answers[prevIdx] !== undefined);
    }
  };

  const results = useMemo(() => {
    if (gameState !== 'results') return null;
    let score = 0;
    const wrongQuestions: Array<{ q: any; picked: number | undefined }> = [];
    testQuestions.forEach((q, index) => {
      if (answers[index] === q.correctIndex) score++;
      else wrongQuestions.push({ q, picked: answers[index] });
    });
    const percentage = testQuestions.length > 0 ? (score / testQuestions.length) * 100 : 0;
    const isPass = percentage >= currentData.passThreshold * 100;
    return { score, percentage, isPass, wrongQuestions };
  }, [gameState, testQuestions, answers, currentData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleKanjiClick = (kanji: string, furigana: string) => {
    if (testMode === 'real') return; // No dictionary help in Real Test mode
    const entry = mergedDictionary[kanji];
    setSelectedKanjiInfo({ kanji, furigana, ...(entry ?? { meaning: { en: t.unknown, de: t.unknown }, desc: { en: '', de: '' } }) });
  };

  const renderKanjiModal = () => {
    if (!selectedKanjiInfo) return null;
    const entry = mergedDictionary[selectedKanjiInfo.kanji];
    const fallback = entry ? null : lookupReadings(selectedKanjiInfo.kanji);
    const onyomi = entry?.onyomi || fallback?.onyomi || '';
    const kunyomi = entry?.kunyomi || fallback?.kunyomi || '';
    const jlpt = entry?.jlpt || fallback?.jlpt || '';
    const hasReadings = onyomi || kunyomi;
    const jlptColor = jlpt === 'N5' ? 'bg-emerald-100 text-emerald-700' : jlpt === 'N4' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';

    // Helper: render a single reading with 🔊 button
    const ReadingRow = ({ label, reading, bg }: { reading: string; bg: string; label: string }) => {
      if (!reading) return null;
      return (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${bg}`}>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 w-20">{label}</span>
          <span className="font-bold text-gray-800 text-sm flex-1">{reading}</span>
          {ttsSupported() && (
            <button
              onClick={() => speak(reading, ttsRate)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 transition-colors text-sm shrink-0"
              title={lang === 'de' ? `${label} anhören` : `Listen to ${label}`}
              aria-label={lang === 'de' ? `${label} anhören` : `Listen to ${label}`}
            >
              🔊
            </button>
          )}
        </div>
      );
    };

    return (
      <div
        className={`${isMobile ? 'absolute' : 'fixed'} inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm`}
        onClick={() => setSelectedKanjiInfo(null)}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 md:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header: kanji + furigana + TTS + badge + close */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-700 font-bold tracking-widest text-sm">{selectedKanjiInfo.furigana}</span>
                {ttsSupported() && (
                  <button
                    onClick={() => speak(selectedKanjiInfo.furigana, ttsRate)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors text-sm"
                    title={t.ttsPronounce}
                    aria-label={t.ttsPronounce}
                  >
                    🔊
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-5xl md:text-6xl font-black text-gray-900 leading-none">{selectedKanjiInfo.kanji}</h3>
                {jlpt && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${jlptColor}`}>{jlpt}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedKanjiInfo(null)}
              className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* Meaning */}
            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">{t.meaning}</h4>
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {selectedKanjiInfo.meaning ? selectedKanjiInfo.meaning[lang] : t.unknown}
              </p>
            </div>

            {/* Readings (On'yomi / Kun'yomi) — only for single kanji */}
            {hasReadings && (
              <div>
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  {lang === 'de' ? 'Lesungen' : 'Readings'}
                </h4>
                <div className="space-y-1.5">
                  <ReadingRow reading={onyomi} bg="bg-indigo-50" label="音 On" />
                  <ReadingRow reading={kunyomi} bg="bg-green-50" label="訓 Kun" />
                </div>
              </div>
            )}

            {/* Context description */}
            {selectedKanjiInfo.desc && selectedKanjiInfo.desc[lang] && (
              <div>
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">{t.context}</h4>
                <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl">
                  {selectedKanjiInfo.desc[lang]}
                </p>
              </div>
            )}

            {/* Fallback: not in dictionary note */}
            {!entry && (
              <p className="text-[10px] text-gray-400 italic text-center">
                {lang === 'de' ? 'Nicht im Wörterbuch — Lesungen als Referenz angezeigt' : 'Not in dictionary — readings shown as reference'}
              </p>
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
              <div className="bg-pink-100 text-pink-700 p-2 rounded-xl">
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
      <nav aria-label="Quick Actions" className="flex items-center gap-2 ml-auto">
        {gameState !== 'intro' && (
          <button
            onClick={goHome}
            title={t.home}
            aria-label={t.home}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        )}
        {renderLevelSwitcher()}
        {gameState === 'testing' && (
          <button
            onClick={restartTest}
            title={t.restart}
            aria-label={t.restart}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        {/* Support — compact icon */}
        <button
          onClick={() => setShowSupportModal(true)}
          title={t.supportUs}
          aria-label={t.supportUs}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors shrink-0"
        >
          <IconHeart className="w-4 h-4" />
        </button>
        {/* Pro — only for logged-out or free users */}
        {!auth.isPro && (
          <button
            onClick={() => setGameState('profile')}
            title={t.goPro}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors shrink-0 font-bold text-sm"
            aria-label={t.goPro}
          >
            ⭐
          </button>
        )}
        {/* Language */}
        <button
          onClick={() => setLang(l => (l === 'en' ? 'de' : 'en'))}
          title={lang === 'en' ? 'Deutsch' : 'English'}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shrink-0 font-bold text-xs"
          aria-label="Language"
        >
          {lang === 'en' ? 'DE' : 'EN'}
        </button>
        {/* Account: avatar opens profile modal / sign-in button */}
        {auth.isLoggedIn ? (
          <button
            onClick={() => setGameState('profile')}
            title={auth.user?.name || 'Profil'}
            aria-label={t.navOpenProfile}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-colors shrink-0"
          >
            {auth.user?.name?.charAt(0).toUpperCase() || '?'}
            {auth.isPro && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[8px] shadow-sm border border-white">⭐</span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            title={t.navSignIn}
            aria-label={t.navSignIn}
            className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </nav>
    );
  };

  const renderAppContent = () => {
    if (gameState === 'intro') {
      return (
        <main className={`bg-gray-50 text-gray-800 flex items-center justify-center font-sans flex-1 relative ${isMobile ? 'min-h-full p-0' : 'min-h-screen p-4'}`}>
          <div className="absolute top-4 right-4 z-[60]">
            {renderNavControls()}
          </div>
          <div className={`w-full bg-white overflow-hidden flex flex-col ${isMobile ? 'max-w-full rounded-none shadow-none min-h-full' : 'max-w-3xl rounded-2xl shadow-xl border border-gray-100'}`}>
            <header className={`bg-emerald-600 text-center text-white shrink-0 ${isMobile ? 'p-6 pt-16' : 'p-8'}`}>
              <h1 className={`font-bold mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{currentData.uiStrings.title}</h1>
              <p className={`text-emerald-50 opacity-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>{currentData.uiStrings.subtitle}</p>
            </header>
            <section className={`flex-1 flex flex-col ${isMobile ? 'p-4 overflow-y-auto' : 'p-8'}`}>
              <AdBanner slotId="intro-top-banner" />

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
                  {!auth.isPro && (
                    <div className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg flex items-center gap-1">
                      <span>⭐</span> {(() => { try { return localStorage.getItem('jlpt-real-trial-used') === 'true' ? 'PRO' : '1 FREE TRIAL'; } catch { return '1 FREE TRIAL'; } })()}
                    </div>
                  )}
                  <div className="text-emerald-700 mb-3 bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <h2 className={`font-bold text-gray-800 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>{t.realTestTitle}</h2>
                  <p className={`text-gray-500 mb-4 flex-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {t.realTestDesc(currentData.questionsPerTest, currentData.timeMinutes)}
                  </p>
                  {!auth.isPro && (
                    <p className="text-amber-700 text-xs font-bold mb-2 flex items-center gap-1">
                      {(() => { try { return localStorage.getItem('jlpt-real-trial-used') === 'true'; } catch { return false; } })()
                        ? <>🔒 Pro subscription required for more attempts</>
                        : <>🎁 Try it once free — no account needed</>
                      }
                    </p>
                  )}
                  <button
                    onClick={() => startTest('real')}
                    className={`w-full font-bold py-3 px-4 rounded-lg shadow-sm transition-all active:scale-95 text-sm md:text-base mt-auto ${auth.isPro ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                  >
                    {auth.isPro
                      ? t.startReal
                      : (() => { try { return localStorage.getItem('jlpt-real-trial-used') === 'true'; } catch { return false; } })()
                        ? '⭐ Upgrade to Unlock'
                        : 'Start Free Trial'
                    }
                  </button>
                </div>
                <div className={`border border-blue-200 rounded-xl hover:shadow-lg transition-shadow flex flex-col bg-blue-50 relative overflow-hidden ${isMobile ? 'p-5' : 'p-6'}`}>
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t.guided}</div>
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">
                    FREE
                  </div>
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
              <AdBanner slotId="intro-bottom-banner" />

              {/* Affiliate: Recommended JLPT Books */}
              <BookRecommendations t={t} lang={lang} />

              {/* Affiliate: JapanesePod101 */}
              <AffiliateBanner t={t} lang={lang} />

              {/* Affiliate: Study in Japan */}
              <StudyInJapanBanner t={t} lang={lang} />

              <div className={`text-center text-gray-600 shrink-0 ${isMobile ? 'mt-4 text-xs' : 'mt-8 text-sm'}`}>
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
                        ? 'Ja — der Lernmodus ist dauerhaft kostenlos (10 Fragen pro Test, Furigana-Wörterbuch, Erklärungen) und Sie erhalten 1 kostenloses Real-Test-Trial, ganz ohne Konto. Für unbegrenzte Real-Tests, volle 30 Fragen und werbefreies Erlebnis gibt es das Pro-Abonnement ($4.99/Monat oder $29.99/Jahr).'
                        : 'Yes — Learning Mode is free forever (10 questions per test, furigana dictionary, instant explanations) and you get 1 free Real Test trial, no account needed. For unlimited Real Tests, the full 30 questions per test, and an ad-free experience, there is the Pro subscription ($4.99/month or $29.99/year).'}
                    </p>
                  </details>
                  <details className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      {lang === 'de' ? 'Was ist im Pro-Abonnement enthalten?' : 'What does the Pro subscription include?'}
                    </summary>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                      {lang === 'de'
                        ? 'Pro ($4.99/Monat oder $29.99/Jahr) umfasst: unbegrenzte Real-Tests im Prüfungsformat, volle 30 Fragen pro Test, Schwachstellen-Analyse nach Kategorie mit gezieltem Trainingsmodus, PDF-Export mit Erklärungen, automatische Speicherung Ihrer Testergebnisse und werbefreies Erlebnis. Jederzeit kündbar ohne E-Mail oder Anruf — direkt in der App.'
                        : 'Pro ($4.99/month or $29.99/year) includes: unlimited Real Tests in exam format, the full 30 questions per test, weakness analysis by category with targeted training mode, PDF export of your results with explanations, automatic saving of your test history, and an ad-free experience. Cancel anytime without email or phone call — directly in the app.'}
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
                        <td className="px-4 py-2 font-bold text-emerald-700">N5</td>
                        <td className="px-4 py-2 text-gray-600">~100</td>
                        <td className="px-4 py-2 text-gray-600">~800</td>
                        <td className="px-4 py-2 text-gray-600">90 min</td>
                        <td className="px-4 py-2 text-gray-600">80/180</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-2 font-bold text-emerald-700">N4</td>
                        <td className="px-4 py-2 text-gray-600">~300</td>
                        <td className="px-4 py-2 text-gray-600">~1,500</td>
                        <td className="px-4 py-2 text-gray-600">115 min</td>
                        <td className="px-4 py-2 text-gray-600">90/180</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold text-emerald-700">N3</td>
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
                  {currentQuestionIndex + 1} <span className="text-gray-600 font-normal ml-1">/ {testQuestions.length}</span>
                </div>
                {srsReviewActive && (
                  <div
                    className="bg-amber-100 text-amber-800 font-bold rounded-md flex items-center gap-1 px-2 py-0.5 text-xs"
                    title={t.srsModeHint}
                  >
                    {t.srsModeBadge}
                  </div>
                )}
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
                <span>{renderFurigana(currentData.instruction, handleKanjiClick, testMode === 'learning')}</span>
                {testMode === 'learning' && (
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-blue-600 italic">{t.clickKanji}</span>
                    {ttsSupported() && (
                      <div className="relative flex items-center gap-1">
                        <select
                          value={ttsRate}
                          onChange={(e) => { const r = parseFloat(e.target.value); setTtsRate(r); saveRate(r); }}
                          className="text-xs border border-blue-200 rounded-md px-1 py-0.5 bg-white text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          title={t.ttsSpeed}
                          aria-label={t.ttsSpeed}
                        >
                          <option value="0.5">0.5x</option>
                          <option value="0.75">0.75x</option>
                          <option value="1.0">1.0x</option>
                        </select>
                        {showVoiceHint && !hasGoodJapaneseVoice() && (
                          <button
                            onClick={() => { setShowVoiceHint(false); try { localStorage.setItem('jlpt-voice-hint-dismissed', 'true'); } catch {} }}
                            className="text-[10px] text-blue-600 underline cursor-help"
                            title={lang === 'de' ? "Klicke zum Ausblenden. Für bessere Qualität: Systemeinstellungen → Sprache → japanische Stimme installieren" : "Click to hide. For better quality: System Settings → Language → install a Japanese voice"}
                          >
                            {t.ttsVoiceImprove}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2">
                <h2 className={`flex-1 text-gray-900 leading-relaxed whitespace-pre-wrap font-medium pb-1 pt-1 ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                  {renderFurigana(currentQuestion.text, handleKanjiClick, testMode === 'learning')}
                </h2>
                {testMode === 'learning' && ttsSupported() && (
                  <button
                    onClick={() => speak(currentQuestion.text, ttsRate)}
                    title={t.ttsReadQuestion}
                    className="shrink-0 mt-1 w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                    aria-label={t.ttsReadQuestion}
                  >
                    🔊
                  </button>
                )}
              </div>
              <div className={`mt-6 grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:mt-10 md:gap-4'}`}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  let buttonStyle = "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700 cursor-pointer";
                  let badgeStyle = "border-gray-400 text-gray-600";
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
                          {renderFurigana(option, handleKanjiClick, testMode === 'learning')}
                        </span>
                        {showFeedback && isCorrectOption && <IconCheck className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-700 ml-auto shrink-0`} />}
                        {showFeedback && isSelected && !isCorrectOption && <IconX className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-red-600 ml-auto shrink-0`} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>

            {showFeedback && (
              <div className={`rounded-xl md:rounded-2xl border ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'} ${isAnswerCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                {/* Banner */}
                <div className={`flex items-center gap-2 mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {isAnswerCorrect ? (
                    <span className="font-bold text-emerald-700 flex items-center gap-1"><IconCheck className="w-5 h-5" /> {t.correct}</span>
                  ) : (
                    <span className="font-bold text-amber-700 flex items-center gap-1"><IconAlertCircle className="w-5 h-5" /> {t.incorrect}</span>
                  )}
                  {/* Category tag */}
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/70 px-2 py-0.5 rounded-full shrink-0">
                    {currentQuestion.category}
                  </span>
                </div>

                {/* Your answer vs correct answer — only when wrong */}
                {!isAnswerCorrect && (
                  <div className={`mb-4 space-y-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-red-600 font-bold text-xs uppercase tracking-wider">✗ {lang === 'de' ? 'Deine Antwort' : 'Your answer'}</span>
                      <span className="text-red-700 line-through font-medium">{renderFurigana(currentQuestion.options[answers[currentQuestionIndex]], handleKanjiClick, testMode === 'learning')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-emerald-700 font-bold text-xs uppercase tracking-wider">✓ {lang === 'de' ? 'Richtig' : 'Correct'}</span>
                      <span className="text-emerald-700 font-bold">{renderFurigana(currentQuestion.options[currentQuestion.correctIndex], handleKanjiClick, testMode === 'learning')}</span>
                    </div>
                  </div>
                )}

                {/* Educational explanation — rendered with ❌/💡 structure */}
                <div className={`text-gray-700 leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {(currentQuestion.explanation[lang] || t.noExp).split(/(?=❌|💡)/).filter((s: string) => s.trim()).map((segment: string, i: number) => {
                    const isTip = segment.startsWith('💡');
                    if (i === 0) {
                      return <p key={i} className="font-medium leading-relaxed">{segment.trim()}</p>;
                    }
                    return (
                      <p key={i} className={`mt-1.5 leading-relaxed flex gap-1.5 ${isTip ? 'text-gray-700' : 'text-gray-600'}`}>
                        <span className="shrink-0">{isTip ? '💡' : '❌'}</span>
                        <span className={isTip ? 'font-medium' : ''}>{segment.replace(/^[❌💡]\s*/, '').trim()}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            <AdBanner slotId="testing-mid-banner" />
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
                  <div className={`inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 mx-auto ${isMobile ? 'w-16 h-16 mb-3' : 'w-24 h-24 mb-4'}`}>
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
                    {results.score} <span className="text-xl text-gray-600">/ {testQuestions.length}</span>
                  </div>
                </div>
                <div className={`w-px h-16 bg-gray-200 hidden ${isMobile ? '' : 'md:block'}`}></div>
                <div className="text-center">
                  <div className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">{t.percentage}</div>
                  <div className={`font-black ${isMobile ? 'text-4xl' : 'text-5xl'} ${results.isPass ? 'text-emerald-700' : 'text-red-700'}`}>
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

              {/* === PRO: Post-test weakness report — wrong questions inline with explanations === */}
              {results.wrongQuestions.length > 0 && (
                <div className="mt-6 text-left bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-red-900 text-sm">{lang === 'de' ? '📋 Deine Fehler im Detail' : '📋 Your Mistakes in Detail'}</h3>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      {results.wrongQuestions.length} {lang === 'de' ? 'Fehler' : 'mistakes'}
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {results.wrongQuestions.map(({ q, picked }) => (
                      <div key={`${(q as any).level || selectedLevel}-${q.id}`} className="bg-white rounded-xl p-3 border border-red-100">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          {(q as any).level || selectedLevel} · {q.category}
                        </p>
                        <p className="text-sm text-gray-900 font-medium mb-2">{q.text}</p>
                        <div className="space-y-1 text-xs">
                          {picked !== undefined ? (
                            <div className="flex items-start gap-1.5 text-red-700">
                              <span className="shrink-0">❌</span>
                              <span>{lang === 'de' ? 'Deine Antwort:' : 'Your answer:'} <strong>{q.options[picked]}</strong></span>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 text-gray-500">
                              <span className="shrink-0">—</span>
                              <span>{lang === 'de' ? 'Nicht beantwortet' : 'Not answered'}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-1.5 text-emerald-700">
                            <span className="shrink-0">✓</span>
                            <span>{lang === 'de' ? 'Richtig:' : 'Correct:'} <strong>{q.options[q.correctIndex]}</strong></span>
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-gray-600 leading-relaxed">
                            {q.explanation[lang]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {auth.isPro && (
                    <button
                      onClick={() => { setSrsReviewActive(true); startDrillFromIds(results.wrongQuestions.map((w: any) => ({ id: w.q.id, level: (w.q as any).level || selectedLevel }))); }}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
                    >
                      🎯 {lang === 'de' ? 'Diese Fragen jetzt üben' : 'Drill these now'}
                    </button>
                  )}
                </div>
              )}

              {!auth.isLoggedIn && (
                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-emerald-700 font-bold text-sm mb-2">Want to save your progress?</p>
                  <p className="text-emerald-700 text-xs mb-3">Sign up to track your history, analytics, and weak points across sessions.</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors"
                  >
                    Create free account →
                  </button>
                </div>
              )}
            </div>

            <AdBanner slotId="results-banner" />

            {/* Softer donation ask on results */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6 text-center">
              <p className="text-pink-700 font-bold text-sm mb-2">{t.foundHelpful}</p>
              <p className="text-pink-700 text-xs mb-3">{t.supportFree}</p>
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
                    onClick={() => setGameState('profile')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors shrink-0"
                  >
                    {t.goPro}
                  </button>
                </div>
              </div>
            )}

            <section className={`space-y-4 ${isMobile ? 'mb-8' : 'space-y-6'}`}>
              <div className="flex items-center justify-between px-2 mb-3">
                <h2 className={`font-bold text-gray-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{t.detailedReview}</h2>
                {auth.isPro && (
                  <button
                    onClick={() => window.print()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                    title={lang === 'de' ? "Als PDF exportieren" : "Export as PDF"}
                  >
                    📄 Als PDF exportieren
                  </button>
                )}
              </div>
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
                            icon = <IconCheck className="w-4 h-4 text-emerald-700 shrink-0" />;
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
                        <p className={`text-red-700 font-medium ${isMobile ? 'mt-2 text-sm' : 'mt-4'}`}>{t.unanswered}</p>
                      )}
                      <div className={`bg-gray-50 rounded-lg border border-gray-100 ${isMobile ? 'mt-3 p-3' : 'mt-4 p-4'}`}>
                        <h4 className="text-xs font-bold text-gray-600 uppercase mb-1">{t.explanation}</h4>
                        <p className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>{q.explanation[lang]}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Hidden print/PDF report — visible only in print */}
            {printMode === 'test' && (
            <div id="print-report" className="hidden print:block">
              <h1>JLPT Test Hub — {lang === 'de' ? 'Testergebnis' : 'Test Result'}</h1>
              <div className="print-meta">
                <p><strong>{lang === 'de' ? 'Level' : 'Level'}:</strong> {selectedLevel} | <strong>{lang === 'de' ? 'Modus' : 'Mode'}:</strong> {testMode === 'real' ? (lang === 'de' ? 'Real-Test' : 'Real Test') : (lang === 'de' ? 'Lernmodus' : 'Learning Mode')} | <strong>{lang === 'de' ? 'Datum' : 'Date'}:</strong> {new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</p>
                <p><strong>{lang === 'de' ? 'Ergebnis' : 'Result'}:</strong> {results.score}/{testQuestions.length} ({results.percentage.toFixed(0)}%) — {results.isPass ? (lang === 'de' ? 'BESTANDEN' : 'PASSED') : (lang === 'de' ? 'NICHT BESTANDEN' : 'NOT PASSED')} ({lang === 'de' ? '60% benötigt' : '60% required'})</p>
                {auth.user && <p><strong>{lang === 'de' ? 'Name' : 'Name'}:</strong> {auth.user.name} ({auth.user.email})</p>}
              </div>
              {testQuestions.map((q, index) => {
                const ua = answers[index];
                const ok = ua === q.correctIndex;
                return (
                  <div key={`pr-${index}`} className="print-q">
                    <p><strong>Frage {index + 1}</strong> [{q.category}] — <span className={ok ? 'print-correct' : 'print-wrong'}>{ok ? '✓ Richtig' : ua === undefined ? '— Nicht beantwortet' : `✗ Falsch (richtig: ${q.correctIndex + 1})`}</span></p>
                    <p>{q.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')}</p>
                    <p>Richtige Antwort: {q.options[q.correctIndex].replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')}</p>
                    <p className="print-meta">Erklärung: {q.explanation[lang]}</p>
                  </div>
                );
              })}
              <p className="print-meta" style={{marginTop: '16pt'}}>Erstellt mit JLPT Test Hub — jlpttesthub.com</p>
            </div>
            )}
          </div>
        </main>
      );
    }
    if (gameState === 'profile') {
      return <ProfilePage
        onClose={goHome}
        nav={renderNavControls()}
        isMobile={isMobile}
        t={t}
        isLoggedIn={auth.isLoggedIn}
        isPro={auth.isPro}
        user={auth.user}
        subscription={auth.subscription}
        onUpgrade={async (plan) => {
          const result = await auth.upgrade(plan);
          if (result.success && result.url) {
            window.location.href = result.url;
          } else if (result.error) {
            alert(result.error);
          }
        }}
        onSignIn={() => setShowAuthModal(true)}
        onCancelSub={async () => {
          const result = await auth.cancelSubscription();
          if (result.error) alert(result.error);
        }}
        onLogout={auth.logout}
        onFetchProgress={auth.fetchProgress}
        onFetchWeakness={() => auth.fetchWeaknessSummary().then(d => { if (d) setWeaknessData(d); })}
        lang={lang}
        weaknessData={weaknessData}
        srsDueCount={srsDueCount}
        srsNewCount={srsNewCount}
        onStartSrsPractice={startSrsPractice}
        notebookData={notebookData}
        onStartSrsReview={startSrsReview}
        onStartNotebookTraining={(pairs) => { setSrsReviewActive(true); startDrillFromIds(pairs); }}
        onRefreshNotebook={() => auth.fetchMistakeNotebook()}
        onSetNotebookData={setNotebookData}
        onExportNotebookPdf={exportNotebookPdf}
        onStartCategoryDrill={startCategoryDrill}
        selectedLevelForDrill={selectedLevel}
        onMasterQuestion={async (qid) => {
          await auth.masterQuestion(qid, selectedLevel);
          const fresh = await auth.fetchWeaknessSummary();
          setWeaknessData(fresh);
        }}
      />;
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
        onImpressum={() => setShowImpressumModal(true)}
        onAccessibility={() => setShowAccessibilityModal(true)}
        onCookies={() => { try { localStorage.removeItem(COOKIE_KEY); } catch {} setCookieConsentGiven(false); }}
        lang={lang}
      />
      {renderKanjiModal()}
      {renderSupportModal()}
      {queuedFlushed > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg"
          role="status"
        >
          {lang === 'de'
            ? `${queuedFlushed} gespeichert${queuedFlushed === 1 ? 'es Testergebnis' : 'e Testergebnisse'} hochgeladen`
            : `Uploaded ${queuedFlushed} saved test result${queuedFlushed === 1 ? '' : 's'}`}
        </div>
      )}
      {/* Notebook PDF — rendered at root so it prints from any page */}
      {printMode === 'notebook' && (
        <div id="print-report" className="hidden print:block">
          <h1>JLPT Test Hub — {lang === 'de' ? 'Fehlerheft' : 'Mistake Notebook'}</h1>
          <div className="print-meta">
            <p><strong>{lang === 'de' ? 'Datum' : 'Date'}:</strong> {new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')} | <strong>{lang === 'de' ? 'Fehler' : 'Mistakes'}:</strong> {notebookData?.questions?.length || 0}</p>
          </div>
          {(notebookData?.questions || []).map((wq: any) => {
            const q = findQuestion(wq.question_id, wq.level);
            if (!q) return null;
            return (
              <div key={`nb-${wq.level}-${wq.question_id}`} className="print-q">
                <p><strong>{wq.level} #{wq.question_id}</strong> [{q.category}] — {wq.times_wrong || wq.attempts}{lang === 'de' ? '× falsch' : '× wrong'}</p>
                <p>{q.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')}</p>
                <p className="print-correct">{lang === 'de' ? 'Richtige Antwort' : 'Correct answer'}: {q.options[q.correctIndex].replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')}</p>
                <p className="print-meta">{lang === 'de' ? 'Erklärung' : 'Explanation'}: {q.explanation[lang]}</p>
              </div>
            );
          })}
          <p className="print-meta" style={{marginTop: '16pt'}}>Erstellt mit JLPT Test Hub — jlpttesthub.com</p>
        </div>
      )}

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        login={auth.login}
        signup={auth.signup}
        forgotPassword={auth.forgotPassword}
      />
      <LegalModal show={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy"><PrivacyPolicyContent /></LegalModal>
      <LegalModal show={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Service"><TermsContent /></LegalModal>
      <LegalModal show={showSellerModal} onClose={() => setShowSellerModal(false)} title="Anbieterkennzeichnung"><SellerDisclosureContent /></LegalModal>
      <LegalModal show={showImpressumModal} onClose={() => setShowImpressumModal(false)} title="Impressum"><ImpressumContent /></LegalModal>
      <LegalModal show={showAccessibilityModal} onClose={() => setShowAccessibilityModal(false)} title="Barrierefreiheitserklärung"><AccessibilityContent /></LegalModal>
      {!cookieConsentGiven && <CookieBanner onConsent={() => setCookieConsentGiven(true)} onOpenPrivacy={() => setShowPrivacyModal(true)} />}
    </div>
  );
}