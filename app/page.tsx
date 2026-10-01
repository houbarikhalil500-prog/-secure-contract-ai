"use client";

import React, { useState } from 'react';

export default function HomePage() {
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vulns, setVulns] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // حساب أعداد الثغرات ديناميكياً
  const criticalCount = vulns.filter(v => v.severity === 'CRITICAL').length;
  const highCount = vulns.filter(v => v.severity === 'HIGH').length;
  const mediumCount = vulns.filter(v => v.severity === 'MEDIUM').length;

  // حساب مؤشر درجة الأمان التقديرية
  const calculateSecurityScore = () => {
    if (vulns.length === 0) return 100;
    let penalty = (criticalCount * 40) + (highCount * 25) + (mediumCount * 10);
    let score = 100 - penalty;
    return score < 0 ? 0 : score;
  };

  const score = calculateSecurityScore();

  const handleAudit = async () => {
    if (!contractText.trim()) {
      alert("الرجاء إدخال نص العقد أولاً!");
      return;
    }
    
    setIsLoading(true);
    setVulns([]);
    setHasSearched(false);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract: contractText }),
      });
      const data = await response.json();
      if (data.success) {
        setVulns(data.vulnerabilities || []);
        setHasSearched(true);
      } else {
        alert("فشل في معالجة العقد البرمجي.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return { borderRight: '5px solid #ef4444', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#991b1b' };
      case 'HIGH': return { borderRight: '5px solid #f97316', border: '1px solid #ffedd5', backgroundColor: '#fff7ed', color: '#9a3412' };
      case 'MEDIUM': return { borderRight: '5px solid #eab308', border: '1px solid #fef9c3', backgroundColor: '#fefce8', color: '#854d0e' };
      default: return { border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#334155' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', direction: 'rtl', padding: '20px', boxSizing: 'border-box' }}>
      <header style={{ textAlign: 'center', padding: '40px 10px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '16px', marginBottom: '25px', boxShadow: '0 4px 15px rgba(15,23,42,0.1)' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '30px', fontWeight: '800', letterSpacing: '0.5px' }}>🛡️ Secure Contract AI</h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8', fontWeight: '500' }}>منصة التدقيق الأمني المتقدمة رقم #1 لتأمين وفحص العقود الذكية</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>أدخل كود العقد الذكي المراد تحليله قسرياً:</label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="قم بلصق كود العقد (Solidity) هنا للبدء بالفحص والمحاكاة الفورية..."
            style={{ width: '100%', height: '220px', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', marginBottom: '20px', outline: 'none', fontFamily: 'monospace', backgroundColor: '#fafafa', lineHeight: '1.5' }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleAudit} disabled={isLoading} style={{ flex: 1, padding: '14px', backgroundColor: isLoading ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)', transition: 'all 0.2s' }}>
              {isLoading ? '⏳ جاري تشغيل المحركات والمحاكاة...' : '🔍 ابدأ التدقيق الأمني الفوري'}
            </button>
            <button onClick={() => { setContractText(''); setVulns([]); setHasSearched(false); }} style={{ padding: '14px 25px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.2)' }}>🗑️ مسح</button>
          </div>
        </div>

        {/* لوحة الإحصائيات العدادية المتقدمة */}
        {hasSearched && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '18px', fontWeight: '800' }}>📊 لوحة نتائج التدقيق الرقمية:</h2>
            
            {/* شبكة العدادات ومؤشر الأمان */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'block' }}>🛡️ معدل أمان العقد</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: score > 70 ? '#166534' : score > 40 ? '#854d0e' : '#991b1b' }}>{score}%</span>
              </div>
              <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fee2e2' }}>
                <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: '600', display: 'block' }}>🔴 ثغرات حرجة</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#ef4444' }}>{criticalCount}</span>
              </div>
              <div style={{ backgroundColor: '#fff7ed', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #ffedd5' }}>
                <span style={{ fontSize: '13px', color: '#9a3412', fontWeight: '600', display: 'block' }}>🟠 ثغرات عالية</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#f97316' }}>{highCount}</span>
              </div>
              <div style={{ backgroundColor: '#fefce8', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fef9c3' }}>
                <span style={{ fontSize: '13px', color: '#854d0e', fontWeight: '600', display: 'block' }}>🟡 ثغرات متوسطة</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#eab308' }}>{mediumCount}</span>
              </div>
            </div>

            {vulns.length === 0 ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', padding: '25px', borderRadius: '14px', color: '#166534', boxShadow: '0 4px 10px rgba(34,197,94,0.1)' }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700' }}>✅ العقد ذو بنية آمنة ومثالية!</h3>
                <p style={{ margin: 0, fontSize: '15px' }}>لم يتم العثور على أي ثغرات برمجية قياسية أو نقاط ضعف معروفة داخل الأسطر البرمجية المفحوصة.</p>
              </div>
            ) : (
              vulns.map((v, index) => (
                <div key={index} style={{ ...getSeverityStyle(v.severity), padding: '22px', borderRadius: '14px', marginBottom: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700' }}>{v.title}</h3>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '10px 0' }}>{v.description}</p>
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(0,0,0,0.05)', fontSize: '15px', fontWeight: '600' }}>{v.solution}</div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
