import React from 'react';
import { Link } from 'react-router-dom';

export const Intro: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-lg">
            <span className="text-2xl">📚</span>
            <span className="font-black text-gray-900">JLPT Test Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Sign In</Link>
            <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            JLPT Test Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            THE #1 BEST JLPT TEST SIMULATOR & PREPARATION GUIDE
          </p>
          <p className="text-gray-500 max-w-xl mx-auto">
            Practice with 150+ real official JLPT questions across N5, N4, and N3 levels.
            Interactive furigana dictionary, instant explanations, and timed simulations.
          </p>
        </div>

        {/* Level Selection */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LevelCard level="N5" color="emerald" questions={50} kanji={100} vocab={800} />
            <LevelCard level="N4" color="blue" questions={50} kanji={300} vocab={1500} />
            <LevelCard level="N3" color="purple" questions={50} kanji={650} vocab={3000} />
          </div>
        </section>

        {/* Mode Selection */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Practice Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <ModeCard
              icon="⏱️"
              title="Real Test Mode"
              description="Timed simulation with 30 random questions. No immediate feedback. Experience real exam pressure."
              features={["60-minute timer", "30 random questions", "Score & pass/fail result", "Review all answers after completion"]}
              cta="Start Real Test"
              href="/test/N5/real"
              color="emerald"
            />
            <ModeCard
              icon="📖"
              title="Learning Practice Mode"
              description="Untimed practice with instant explanations. Learn why each answer is right or wrong."
              features={["No time limit", "Instant feedback per question", "Detailed explanations", "Click kanji for readings/meanings"]}
              cta="Start Learning Mode"
              href="/test/N5/learning"
              color="blue"
            />
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why JLPT Test Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon="📖" title="Real Exam Questions" desc="150+ official questions from the 2018 JLPT Practice Workbook" />
            <FeatureCard icon="🔍" title="Interactive Furigana" desc="Click any kanji to see reading, meaning, and context" />
            <FeatureCard icon="📊" title="Progress Tracking" desc="Track your progress with detailed analytics and weak-point analysis" />
            <FeatureCard icon="📱" title="Mobile & Desktop" desc="Responsive design works perfectly on all devices" />
            <FeatureCard icon="🎯" title="Weak Point Analysis" desc="Identify and review your weak areas with targeted practice" />
            <FeatureCard icon="📄" title="PDF Export" desc="Download detailed results for offline review (Pro)" />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">Join thousands of learners preparing for the JLPT with real exam questions.</p>
          <div className="flex justify-center gap-4">
            <Link to="/test/N5/learning" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-colors">
              Start Learning Free
            </Link>
            <Link to="/upgrade" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-colors">
              Upgrade to Pro
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">JLPT Test Hub — Free JLPT N5, N4, N3 Practice Tests</p>
          <p className="text-xs mt-2">Not affiliated with the Japan Foundation or JEES. JLPT is a registered trademark.</p>
        </div>
      </footer>
    </div>
  );
}

function LevelCard({ level, color, questions, kanji, vocab }: { level: string; color: string; questions: number; kanji: number; vocab: number }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300',
    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-300',
  };

  return (
    <Link
      to={`/test/${level}/learning`}
      className={`group block bg-white rounded-2xl p-8 shadow-sm border-2 transition-all ${colors[color as keyof typeof colors] || colors.emerald}`}
    >
      <div className="text-center">
        <h3 className="text-3xl font-black mb-2">{level}</h3>
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{questions}</p>
            <p className="text-gray-500 text-xs">Questions</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{kanji}+</p>
            <p className="text-gray-500 text-xs">Kanji</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{vocab}+</p>
            <p className="text-gray-500 text-xs">Vocab</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ModeCard({ icon, title, description, features, cta, href, color }: { 
  icon: string; 
  title: string; 
  description: string; 
  features: string[]; 
  cta: string; 
  href: string; 
  color: string 
}) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300',
    blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300',
    purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-300',
  };

  return (
    <Link
      to={href}
      className={`group block bg-white rounded-2xl p-8 shadow-sm border-2 transition-all ${colors[color as keyof typeof colors] || colors.emerald}`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <a href={href} className={`block w-full py-3 px-4 rounded-xl font-bold text-center transition-all ${
        color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
        color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
        'bg-purple-600 hover:bg-purple-700 text-white'
      } shadow-sm transition-all active:scale-95`}>
        {cta}
      </a>
    </Link>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}