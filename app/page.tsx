"use client";

import React, { useState } from 'react';

export default function HomePage() {
  // 1. تعريف حالات المتغيرات (React States)
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vulns, setVulns] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 2. حساب المتغيرات ديناميكياً بناءً على مصفوفة الثغرات vulns بشكل آمن ✅
  const criticalCount = vulns.filter(v => v.severity === 'CRITICAL').length;
  const highCount = vulns.filter(v => v.severity === 'HIGH').length;
  const mediumCount = vulns.filter(v => v.severity === 'MEDIUM').length;

  // دالة حساب معدل الأمان الإجمالي
  const calculateSecurityScore = () => {
    if (vulns.length === 0) return 100;
    const penalty = (criticalCount * 40) + (highCount * 25) + (mediumCount * 10);
    const score = 100 - penalty;
    return score < 0 ? 0 : score;
  };

  const score = calculateSecurityScore();

  // 3. دالة الفحص والتدقيق الأمني (تم إغلاقها بشكل مستقل وصحيح) ✅
  const handleAudit = async () => {
    if (!contractText.trim()) {
      alert("الرجاء إدخال كود العقد أولاً!");
      return;
    }
    
    setIsLoading(true);
    try {
      // هنا تضع كود الاتصال بالخلفية أو الـ API الخاص بك مستقبلاً
      // كمثال لمحاكاة النجاح:
      setVulns([
        { severity: 'HIGH', message: 'Reentrancy vulnerability detected' }
      ]);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. دالة طباعة وتحميل التقرير
  const handleDownloadPDF = () => {
    window.print();
  };

  // 5. واجهة المستخدم الرسومية الموحدة داخل دالة الـ return البرمجية ✅
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', direction: 'rtl' }}>
      
      {/* رأس الصفحة */}
      <header style={{ textAlign: 'center', padding: '40px 10px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '16px', margin: '20px 0' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '30px', fontWeight: '800' }}>Secure Contract AI</h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8' }}>منصة التدقيق الأمني المتقدمة رقم #1 لتأمين وفحص العقود الذكية بالذكاء الاصطناعي</p>
      </header>

      {/* صندوق إدخال الكود */}
      <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>العقد الذكي المراد تحليله برمجياً (Solidity):</label>
        <textarea
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="قم بلصق كود العقد هنا للبدء بالفحص والمراجعة الفورية..."
          style={{ width: '100%', height: '220px', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'monospace' }}
        />
      </div>

      {/* أزرار التحكم */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
        <button 
          onClick={handleAudit} 
          disabled={isLoading} 
          style={{ flex: 1, padding: '14px', backgroundColor: isLoading ? '#94a3b8' : '#1e293b', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}
        >
          {isLoading ? 'جاري تشغيل المحركات والمعالجة...' : 'ابدأ التدقيق الأمني الفوري'}
        </button>
        
        <button 
          onClick={() => { setContractText(''); setVulns([]); setHasSearched(false); }} 
          style={{ padding: '14px 25px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}
        >
          مسح الكود
        </button>
      </div>

      {/* لوحة التحكم والنتائج المكتشفة */}
      {hasSearched && (
        <div style={{ marginTop: '10px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0, fontWeight: '800' }}>📊 لوحة نتائج التدقيق الرقمية</h2>
            <button onClick={handleDownloadPDF} style={{ padding: '10px 18px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
              📥 تحميل تقرير PDF
            </button>
          </div>

          {/* شبكة الإحصائيات الحيوية */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'block' }}>🛡️ معدل أمان العقد</span>
              <span style={{ fontSize: '26px', fontWeight: '800', color: score > 70 ? '#166534' : score > 40 ? '#854d0e' : '#991b1b' }}>
                {score}%
              </span>
            </div>

            <div style={{ backgroundColor: '#fef2f2', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fee2e2' }}>
              <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: '600', display: 'block' }}>🚨 ثغرات حرجة</span>
              <span style={{ fontSize: '26px', fontWeight: '800', color: '#ef4444' }}>{criticalCount}</span>
            </div>

            <div style={{ backgroundColor: '#fff7ed', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #ffedd5' }}>
              <span style={{ fontSize: '13px', color: '#9a3412', fontWeight: '600', display: 'block' }}>⚠️ ثغرات عالية</span>
              <span style={{ fontSize: '26px', fontWeight: '800', color: '#f97316' }}>{highCount}</span>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
