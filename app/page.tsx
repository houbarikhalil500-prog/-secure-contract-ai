"use client";

import React, { useState } from 'react';

export default function HomePage() {
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vulns, setVulns] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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
      case 'CRITICAL': return { border: '2px solid #ef4444', backgroundColor: '#fef2f2', color: '#991b1b' };
      case 'HIGH': return { border: '2px solid #f97316', backgroundColor: '#fff7ed', color: '#9a3412' };
      case 'MEDIUM': return { border: '2px solid #eab308', backgroundColor: '#fefce8', color: '#854d0e' };
      default: return { border: '2px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#334155' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', boxSizing: 'border-box' }}>
      <header style={{ textAlign: 'center', padding: '30px 10px', backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '26px' }}>🛡️ Secure Contract AI</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>المنصة الاحترافية الذكية لفحص وتأمين العقود الذكية</p>
      </header>

      <main style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>أدخل كود العقد المراد فحصه:</label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="قم بلصق كود العقد أو النص هنا للبدء بالفحص المتقدم..."
            style={{ width: '100%', height: '180px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', marginBottom: '15px', outline: 'none', fontFamily: 'monospace' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleAudit} disabled={isLoading} style={{ flex: 1, padding: '12px', backgroundColor: isLoading ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? 'جاري تشغيل محركات الفحص...' : '🔍 ابدأ الفحص الأمني'}
            </button>
            <button onClick={() => { setContractText(''); setVulns([]); setHasSearched(false); }} style={{ padding: '12px 20px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ مسح</button>
          </div>
        </div>

        {/* عرض التقارير الملونة بناء على مستوى الخطورة */}
        {hasSearched && (
          <div style={{ marginTop: '25px' }}>
            <h2 style={{ fontSize: '20px', color: '#1e293b', marginBottom: '15px' }}>📊 تقرير الفحص الأمني النهائي:</h2>
            {vulns.length === 0 ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', padding: '20px', borderRadius: '12px', color: '#166534' }}>
                <h3 style={{ marginTop: 0 }}>✅ العقد آمن مبدئياً!</h3>
                <p style={{ margin: 0 }}>لم يتم العثور على ثغرات أمنية شائعة أو حرجة في سطور هذا العقد الذكي.</p>
              </div>
            ) : (
              vulns.map((v, index) => (
                <div key={index} style={{ ...getSeverityStyle(v.severity), padding: '20px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ marginTop: 0, fontSize: '18px' }}>{v.title}</h3>
                  <p style={{ fontSize: '15px', lineHeight: '1.6' }}>{v.description}</p>
                  <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{v.solution}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
