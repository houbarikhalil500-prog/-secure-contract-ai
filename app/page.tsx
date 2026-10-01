"use client";

import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [score, setScore] = useState(100);
  
  // --- النظام التجاري بالتسعيرة الاحترافية ---
  const auditPrice = 49.00; 
  const [userBalance, setUserBalance] = useState(150.00); 
  const [adminEarnings, setAdminEarnings] = useState(0.00); 
  const [lastOpCost, setLastOpCost] = useState(0);

  // 🔐 حماية الصفحة: التوجيه التلقائي لصفحة تسجيل الدخول إذا لم تكن هناك جلسة نشطة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        window.location.href = "/login";
      }
    }
  }, []);

  const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'HIGH').length;

  const handleAudit = async () => {
    if (!contractText.trim()) {
      alert("الرجاء إدخل كود العقد أولاً!");
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

  // دالة الخروج من الحساب
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* شريط الإحصائيات العلوي وزر تسجيل الخروج */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#f1f5f9', padding: '10px 20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div>رصيد العميل الافتراضي: <strong>\${userBalance.toFixed(2)}</strong></div>
          <div>تسعيرة الفحص: <strong style={{ color: 'red' }}>\${auditPrice.toFixed(2)}</strong></div>
          <div>أرباحك المحققة كمالك: <strong style={{ color: 'green' }}>\${adminEarnings.toFixed(2)}</strong></div>
        </div>
        <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🚪 خروج</button>
      </div>

      <header style={{ padding: '20px 0', borderBottom: '1px solid #ccc', marginBottom: '25px' }}>
        <h1>🛡️ Secure Contract AI</h1>
        <p>منصة تدقيق وفحص العقود الذكية بالذكاء الاصطناعي</p>
      </header>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>أدخل كود العقد الذكي (Solidity):</label>
        <textarea
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="قم بلصق كود عقدك الذكي هنا بالكامل..."
          style={{ width: '100%', height: '200px', padding: '10px', fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={handleAudit} disabled={isLoading} style={{ padding: '12px 24px', cursor: 'pointer' }}>
          {isLoading ? 'جاري الفحص واقتطاع المبلغ...' : `ابدأ التدقيق الأمني الفوري (تكلفة: \$${auditPrice})`}
        </button>
        <button onClick={() => { setContractText(''); setVulnerabilities([]); setHasSearched(false); }} style={{ padding: '12px 24px', cursor: 'pointer' }}>
          مسح
        </button>
      </div>

      {hasSearched && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2>📊 نتائج التدقيق الإحصائية</h2>
            <button onClick={handleDownloadPDF} style={{ padding: '8px 16px', cursor: 'pointer' }}>📥 تحميل تقرير PDF</button>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div>🛡️ معدل الأمان: {score}%</div>
            <div>🚨 ثغرات حرجة: {criticalCount}</div>
            <div>⚠️ مشاكل عالية: {highCount}</div>
          </div>

          {vulnerabilities.length > 0 ? (
            <div>
              <h3>🔍 تفاصيل الأخطاء المكتشفة:</h3>
              {vulnerabilities.map((v, idx) => (
                <div key={idx} style={{ padding: '10px', marginBottom: '10px', borderRight: '4px solid red', backgroundColor: '#f9f9f9' }}>
                  <strong>{v.title || `[${v.severity}] ثغرة أمنية`}</strong>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'green', fontWeight: 'bold' }}>🎉 العقد الذكي آمن تماماً وتم توريد الأرباح لحسابك!</div>
          )}
        </div>
      )}
    </main>
  );
}
