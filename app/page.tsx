'use client';
import React, { useState } from 'react';

export default function AuditDashboard() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  const handleAudit = async () => {
    setLoading(true);
    setReport('');
    setError('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractCode: code }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الفحص');
      }

      setReport(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-900 bg-slate-950/50 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SecureContract AI
          </span>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-sm shadow-lg shadow-cyan-500/10">
          Connect Wallet ⚡
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          تدقيق أمان العقود الذكية بالذكاء الاصطناعي الفائق
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          اكتشف الثغرات الأمنية في عقود <span className="text-cyan-400">Solidity</span> خلال ثوانٍ معدودة.
        </p>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-right shadow-2xl backdrop-blur">
          <label className="block text-sm font-semibold text-slate-400 mb-2">
            قم بلصق كود العقد الذكي الخاص بك هنا (Solidity Smart Contract):
          </label>
          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-cyan-300 focus:outline-none focus:border-cyan-500 transition resize-none placeholder-slate-800"
            placeholder="// Paste your Solidity contract here..."
          />

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-500">⚡ يدعم شبكات Ethereum, BNB Chain, and Polygon.</span>
            <button
              onClick={handleAudit}
              disabled={loading}
              className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 font-bold px-8 py-3 rounded-xl transition shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? '⏳ جاري الفحص واستخراج الثغرات...' : '🔍 ابدأ الفحص الأمني الذكي'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-900 text-red-400 rounded-xl text-right text-sm">
            🚨 {error}
          </div>
        )}

        {report && (
          <div className="mt-8 p-6 bg-slate-900 border border-cyan-900/50 rounded-2xl text-right whitespace-pre-wrap font-mono text-sm text-slate-300 shadow-2xl">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-slate-800 pb-2">📋 تقرير الفحص البرمجي الموثق:</h3>
            {report}
          </div>
        )}
      </main>
    </div>
  );
}
