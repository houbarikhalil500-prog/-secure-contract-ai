"use client";
import React, { useState } from 'react';
export default function HomePage() { const [contractText, setContractText] = useState(''); const [isLoading, setIsLoading] = useState(false); const [vulnerabilities, setVulnerabilities] = useState<any[]>([]); const [hasSearched, setHasSearched] = useState(false); const [score, setScore] = useState(100);
// --- النظام التجاري بالتسعيرة الاحترافية --- const auditPrice = 49.00; const [userBalance, setUserBalance] = useState(150.00); const [adminEarnings, setAdminEarnings] = useState(0.00); const [lastOpCost, setLastOpCost] = useState(0);
const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length; const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;
const handleAudit = async () => { if (!contractText.trim()) { alert("الرجاء إدخال كود العقد أولاً!"); return; }

if (userBalance < auditPrice) {
  alert(`رصيد المستخدم غير كافٍ! تكلفة الفحص المتقدم هي \$${auditPrice}`);
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
const handleDownloadPDF = () => { window.print(); };
return ( <main style={{ maxWidth: '900px', margin: '0 auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
    <div style={{ backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', display: 'block' }}>💳 محاكاة رصيد العميل:</span>
      <span style={{ color: '#0f172a', fontSize: '20px', fontWeight: '800' }}>\${userBalance.toFixed(2)}</span>
    </div>
    <div style={{ backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', display: 'block' }}>🏷️ تسعيرة الفحص الاحترافي:</span>
      <span style={{ color: '#ef4444', fontSize: '20px', fontWeight: '800' }}>\${auditPrice.toFixed(2)}</span>
    </div>
    <div style={{ backgroundColor: '#1e3a8a', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #1d4ed8', color: '#ffffff' }}>
      <span style={{ color: '#93c5fd', fontSize: '13px', fontWeight: '600', display: 'block' }}>💰 صافي أرباحك المحققة (المالك):</span>
      <span style={{ color: '#34d399', fontSize: '22px', fontWeight: '900' }}>\${adminEarnings.toFixed(2)}</span>
    </div>
  </div>

  <header style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '20px', marginBottom: '30px' }}>
    <h1 style={{ margin: '0 0 12px 0', fontSize: '34px', fontWeight: '800' }}>🛡️ Secure Contract AI</h1>
    <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>بوابة أمان الـ Web3 الشاملة للشركات والمطورين.

فحص عميق للثغرات الأمنية والمالية المعقدة بأعلى معايير الحماية السيبرانية.</p>
  </header>

  <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
    <label style={{ display: 'block', marginBottom: '14px', fontWeight: '700', color: '#1e293b', fontSize: '16px' }}>أدخل كود العقد الذكي المراد تحليله برمجياً (Solidity):</label>
    <textarea
      value={contractText}
      onChange={(e) => setContractText(e.target.value)}
      placeholder="قم بلصق كود عقدك الذكي هنا بالكامل لتجربة نظام الفحص بالتسعيرة الاحترافية الجديدة..."
      style={{ width: '100%', height: '240px', padding: '18px', borderRadius: '14px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '14px', backgroundColor: '#f8fafc', color: '#334155' }}
    />
  </div>

  <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
    <button 
      onClick={handleAudit} 
      disabled={isLoading} 
      style={{ flex: 1, padding: '16px', backgroundColor: isLoading ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
    >
      {isLoading ? '⚙️ جاري التحليل وتوريد الأرباح الفورية...' : `🚀 تشغيل الفحص المتقدم (السعر المقتطع: \$${auditPrice})`}
    </button>
    <button 
      onClick={() => { setContractText(''); setVulnerabilities([]); setHasSearched(false); }} 
      style={{ padding: '16px 28px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}
    >
      🧹 مسح
    </button>
  </div>

  {hasSearched && (
    <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ fontSize: '24px', color: '#0f172a', margin: 0, fontWeight: '800' }}>📊 لوحة النتائج التفصيلية للعملية</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ fontSize: '14px', backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontWeight: '700' }}>📈 دخل جديد لملفك: +\${lastOpCost.toFixed(2)}</span>
          <button onClick={handleDownloadPDF} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>
            📥 تصدير التقرير PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🛡️ معدل حماية العقد</span>
          <span style={{ fontSize: '32px', fontWeight: '800', color: score > 70 ? '#166534' : score > 40 ? '#b45309' : '#991b1b' }}>
            {score}%
          </span>
        </div>
        <div style={{ backgroundColor: '#fef2f2', padding: '20px', borderRadius: '14px', textAlign: 'center', border: '1px solid #fee2e2' }}>
          <span style={{ fontSize: '14px', color: '#991b1b', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🚨 ثغرات برمجية حرجة</span>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#ef4444' }}>{criticalCount}</span>
        </div>
        <div style={{ backgroundColor: '#fff7ed', padding: '20px', borderRadius: '14px', textAlign: 'center', border: '1px solid #ffedd5' }}>
          <span style={{ fontSize: '14px', color: '#9a3412', fontWeight: '600', display: 'block', marginBottom: '8px' }}>⚠️ مشاكل عالية الخطورة</span>

<span style={{ fontSize: '32px', fontWeight: '800', color: '#f97316' }}>{highCount}</span>
        </div>
      </div>

      {vulnerabilities.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e293b' }}>🔍 تفاصيل الثغرات المكتشفة:</h3>
          {vulnerabilities.map((v, idx) => (
            <div key={idx} style={{ padding: '15px', borderRadius: '12px', backgroundColor: v.severity === 'CRITICAL' ? '#fef2f2' : '#fff7ed', borderLeft: `5px solid ${v.severity === 'CRITICAL' ? '#ef4444' : '#f97316'}`, marginBottom: '12px' }}>
              <strong style={{ color: v.severity === 'CRITICAL' ? '#991b1b' : '#9a3412', display: 'block', marginBottom: '5px' }}>{v.title || `[${v.severity}] ثغرة أمنية`}</strong>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{v.description}</p>
              {v.solution && <p style={{ margin: 0, fontSize: '13px', color: '#16a34a' }}>💡 <strong>الحل:</strong> {v.solution}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', textAlign: 'center', color: '#15803d', fontWeight: '700' }}>
