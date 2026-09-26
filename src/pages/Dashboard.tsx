import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: colors[color]?.split(' ')[0].replace('50', '100') }}>
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const { subscription } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [weakPoints, setWeakPoints] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analytics' | 'weak-points' | 'subscription'>('overview');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes, weakRes] = await Promise.all([
        fetch('/api/progress/stats', { credentials: 'include' }),
        fetch('/api/tests/history?limit=10', { credentials: 'include' }),
        fetch('/api/progress/weak-points', { credentials: 'include' }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (historyRes.ok) {
        const data = await historyRes.json();
        setHistory(data.attempts || []);
      }
      if (weakRes.ok) setWeakPoints((await weakRes.json()).weakPoints || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-gray-900">JLPT Test Hub</span>
            </Link>
            {subscription?.status === 'active' && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">PRO</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Dashboard</Link>
            <Link to="/dashboard/history" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">History</Link>
            <Link to="/dashboard/analytics" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">Analytics</Link>
            {subscription?.status !== 'active' && (
              <Link to="/upgrade" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Go Pro
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex gap-1 bg-gray-100 rounded-xl p-1" aria-label="Dashboard tabs">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'history', label: 'History', icon: '📜' },
              ...(subscription?.status === 'active' ? [
                { id: 'analytics', label: 'Analytics', icon: '📊' },
                { id: 'weak-points', label: 'Weak Points', icon: '🎯' },
              ] : []),
              { id: 'subscription', label: 'Subscription', icon: '⭐' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                disabled={(tab.id === 'analytics' || tab.id === 'weak-points') && subscription?.status !== 'active'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                } ${tab.id === 'analytics' && subscription?.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${tab.id === 'weak-points' && subscription?.status !== 'active' ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <span className="flex items-center gap-1">{tab.icon} {tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Tests Taken" value={stats?.totalTestsTaken || 0} icon="📝" color="emerald" />
              <StatCard title="Questions Answered" value={stats?.totalQuestionsAnswered || 0} icon="❓" color="blue" />
              <StatCard title="Accuracy" value={`${stats?.accuracy || 0}%`} icon="🎯" color="amber" />
              <StatCard title="Study Time" value={`${Math.floor((stats?.totalTimeSpentSeconds || 0) / 60)} min`} icon="⏱️" color="purple" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/test/N5/learning" className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-300 transition-all">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Learning Mode</h3>
                <p className="text-gray-500 text-sm">Practice with instant feedback</p>
              </Link>
              <Link to="/test/N5/real" className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-300 transition-all">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Real Test Mode</h3>
                <p className="text-gray-500 text-sm">Timed simulation with 30 questions</p>
              </Link>
              <Link to="/dashboard/history" className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-300 transition-all">
                <div className="text-4xl mb-2">📜</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Test History</h3>
                <p className="text-gray-500 text-sm">Review your past attempts</p>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Test History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No tests taken yet. <Link to="/test/N5/learning" className="text-emerald-600 hover:underline">Start practicing</Link>
                      </td>
                    </tr>
                  ) : (
                    history.map((attempt: any) => (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(attempt.completed_at)}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {attempt.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attempt.mode === 'real' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {attempt.mode === 'real' ? 'Real Test' : 'Learning'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${getScoreColor(attempt.score)} px-2 py-1 rounded`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && subscription?.status === 'active' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Accuracy by Category</h3>
                <div className="space-y-3">
                  {stats?.weakCategories?.length ? (
                    stats.weakCategories.map((cat: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.round((1 - (cat.error_rate || 0)) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-emerald-600 w-12 text-right">
                            {Math.round((1 - (cat.error_rate || 0)) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Take more tests to see analytics</p>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Study Streak</h3>
                <div className="flex items-center justify-center gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                      {['S','M','T','W','T','F','S'][i]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weak-points' && subscription?.status === 'active' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Weak Points Review</h2>
              <span className="text-sm text-gray-500">{weakPoints.length} items to review</span>
            </div>
            <div className="divide-y divide-gray-100">
              {weakPoints.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <div className="text-4xl mb-2">🎉</div>
                  <p>No weak points identified! Keep up the great work.</p>
                </div>
              ) : (
                weakPoints.map((wp: any, i: number) => (
                  <div key={i} className="px-6 py-4 hover:bg-gray-50 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{wp.text || 'Question'}</p>
                      <p className="text-sm text-gray-500 mt-1">Category: {wp.category || 'Unknown'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Wrong {wp.attempts}×</span>
                        <span className="text-xs text-gray-500">Last missed: {wp.last_wrong_at ? new Date(wp.last_wrong_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        // Mark as mastered
                      }}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      Mark as Mastered
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Subscription Status</h2>
            <div className={`bg-${subscription?.status === 'active' ? 'emerald' : 'gray'}-50 rounded-xl p-6 border border-${subscription?.status === 'active' ? 'emerald-200' : 'gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {subscription?.status === 'active' ? 'Pro Active' : 'Free Plan'}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {subscription?.status === 'active'
                      ? `Pro ${subscription.plan} • Renews ${new Date(subscription.currentPeriodEnd || 0).toLocaleDateString()}`
                      : 'Upgrade to unlock all Pro features'}
                  </p>
                </div>
                {subscription?.status === 'active' ? (
                  <button
                    onClick={() => {}}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Manage Subscription
                  </button>
                ) : (
                  <Link to="/upgrade" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;