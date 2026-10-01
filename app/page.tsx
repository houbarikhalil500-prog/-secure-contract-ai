"use client";

import React, { useState } from 'react';

export default function HomePage() {
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [score, setScore] = useState(100);
  
  // --- النظام التجاري المعتمد ---
  const auditPrice = 49.00; 
  const [userBalance, setUserBalance] = useState(150.00); 
  const [adminEarnings, setAdminEarnings] = useState(0.00); 
  const [lastOpCost, setLastOpCost] = useState(0);

  const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;

  const handleAudit = async () => {
    if (!contractText.trim()) {
      alert("الرجاء إدخال كود العقد أولاً!");
      return;
    }

    if (userBalance < auditPrice) {
      alert(`رصيد العميل غير كافٍ! تكلفة الفحص هي \$${auditPrice}`);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVulnerabilities(data.vulnerabilities);
        
        let penalty = 0;
        data.vulnerabilities.forEach((v: any) => {
          if (v.severity === 'CRITICAL') penalty += 40;
          if (v.severity === 'HIGH') penalty += 25;
          if (v.severity === 'MEDIUM') penalty += 10;
        });
        const currentScore = 100 - penalty;
        setScore(currentScore < 0 ? 0 : currentScore);
        
        setLastOpCost(auditPrice);
        setUserBalance(prev => prev - auditPrice); 
        setAdminEarnings(prev => prev + auditPrice); 
        setHasSearched(true);
      } else {
        alert(data.error || "حدث خطأ غير متوقع");
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال بالخادم الرئيسي");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0b0f19', color: '#f1f5f9', minHeight: '100vh' }}>
      
      {/* 📊 شريط الحسابات والأرباح بتصميم داكن فاخر */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '35px' }}>
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid #1f2937', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
          <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>💳 رصيد حساب العميل الافتراضي:</span>
          <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800' }}>\${userBalance.toFixed(2)}</span>
        </div>
        
        <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid #1f2937', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>🏷️ تسعيرة الفحص الاحترافي:</span>
          <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: '800' }}>\${auditPrice.toFixed(2)}</span>
        </div>
        
        <div style={{ backgroundColor: '#1e1b4b', padding: '20px', borderRadius: '16px', border: '1px solid #312e81', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)' }}>
          <span style={{ color: '#c7d2fe', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '5px' }}>💰 صافي أرباحك المحققة (المالك):</span>
          <span style={{ color: '#34d399', fontSize: '24px', fontWeight: '900' }}>\${adminEarnings.toFixed(2)}</span>
        </div>
      </div>

      {/* لوحة رأس الصفحة الفاخرة */}
      <header style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#111827', borderRadius: '24px', border: '1px solid #1f2937', marginBottom: '40px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
        <h1 style={{ margin: '0 0 14px 0', fontSize: '38px', fontWeight: '800', background: 'linear-gradient(to right, #38bdf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🛡️ Secure Contract AI</h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#9ca3af', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>منصة الذكاء الاصطناعي المتقدمة لفحص وحماية العقود الذكية ضد الثغرات الأمنية والمالية مع نظام جني أرباح فوري ومستقل.</p>
      </header>

      {/* صندوق المدخلات */}
      <div style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '24px', border: '1px solid #1f2937', marginBottom: '35px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <label style={{ display: 'block', marginBottom: '14px', fontWeight: '700', color: '#e5e7eb', fontSize: '17px' }}>أدخل كود العقد الذكي المراد تحليله برمجياً (Solidity):</label>
        <textarea
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="قم بلصق كود عقدك الذكي هنا بالكامل لتجربة نظام الفحص والتسعيرة الفاخرة..."
          style={{ width: '100%', height: '260px', padding: '20px', borderRadius: '16px', border: '1px solid #374151', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#1f2937', color: '#f3f4f6', lineHeight: '1.6' }}
        />
      </div>

      {/* أزرار التحكم والعمليات */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '45px' }}>
        <button 
          onClick={handleAudit} 
          disabled={isLoading} 
          style={{ flex: 1, padding: '18px', backgroundColor: isLoading ? '#4b5563' : '#0284c7', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '17px', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(2,132,199,0.4)' }}
        >
          {isLoading ? '⚙️ جاري تحليل الكود واستلام الأرباح...' : `🚀 تشغيل الفحص المتقدم (اقتطاع: \$${auditPrice})`}
        </button>
        
        <button 
          onClick={() => { setContractText(''); setVulnerabilities([]); setHasSearched(false); }} 
          style={{ padding: '18px 35px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', fontSize: '17px', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}
        >
          🧹 مسح الكود
        </button>
      </div>

      {/* لوحة التحكم والنتائج المكتشفة حركياً */}
      {hasSearched && (
        <div style={{ backgroundColor: '#111827', padding: '35px', borderRadius: '24px', border: '1px solid #1f2937', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ fontSize: '24px', color: '#ffffff', margin: 0, fontWeight: '800' }}>📊 لوحة النتائج التفصيلية للعملية</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', backgroundColor: '#064e3b', color: '#34d399', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', border: '1px solid #047857' }}>📈 دخل جديد لملفك: +\${lastOpCost.toFixed(2)}</span>
              <button onClick={handleDownloadPDF} style={{ padding: '10px 22px', backgroundColor: '#059669', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                📥 تصدير التقرير PDF
              </button>
            </div>
          </div>

          {/* شبكة التقارير البيانية الحيوية */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
            <div style={{ backgroundColor: '#1f2937', padding: '22px', borderRadius: '16px', textAlign: 'center', border: '1px solid #374151' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🛡️ معدل حماية العقد</span>
              <span style={{ fontSize: '34px', fontWeight: '800', color: score > 70 ? '#34d399' : score > 40 ? '#fbbf24' : '#f87171' }}>
                {score}%
              </span>
            </div>

            <div style={{ backgroundColor: '#7f1d1d', padding: '22px', borderRadius: '16px', textAlign: 'center', border: '1px solid #991b1b' }}>
              <span style={{ fontSize: '14px', color: '#fca5a5', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🚨 ثغرات برمجية حرجة</span>
              <span style={{ fontSize: '34px', fontWeight: '800', color: '#fecaca' }}>{criticalCount}</span>
            </div>

            <div style={{ backgroundColor: '#7c2d12', padding: '22px', borderRadius: '16px', textAlign: 'center', border: '1px solid #9a3412' }}>
              <span style={{ fontSize: '14px', color: '#fed7aa', fontWeight: '600', display: 'block', marginBottom: '8px' }}>⚠️ مشاكل عالية الخطورة</span>
              <span style={{ fontSize: '34px', fontWeight: '800', color: '#ffedd5' }}>{highCount}</span>
            </div>
          </div>

          {vulnerabilities.length > 0 ? (
            <div style={{ marginTop: '25px' }}>
              <h3 style={{ fontSize: '19px', marginBottom: '18px', color: '#e5e7eb', borderBottom: '1px solid #374151', paddingBottom: '10px' }}>🔍 تفاصيل الثغرات المكتشفة:</h3>
              {vulnerabilities.map((v, idx) => (
