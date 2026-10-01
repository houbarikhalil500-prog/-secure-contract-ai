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

  // 🔐 حماية الصفحة التلقائية: التوجيه لصفحة تسجيل الدخول إذا لم تكن هناك جلسة نشطة
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
      alert("الرجاء إدخال كود العقد أولاً!");
      return;
    }

    if (userBalance < auditPrice) {
      alert(`رصيدك غير كافٍ! تكلفة الفحص هي \$${auditPrice}\nالرجاء شحن حسابك عبر العملات الرقمية.`);
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

  // دالة شحن فوري مباشرة بقيمة 50 دولار عبر زر ثابت مريح
  const handleQuickCryptoDeposit = () => {
    setUserBalance(prev => prev + 50.00);
    alert("🎉 تم محاكاة رصد البلوكشين بنجاح عبر NOWPayments!\nتم إيداع \$50.00 في محفظتك الرقمية.");
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 📊 شريط الإحصائيات العلوي الثابت */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#f1f5f9', padding: '15px 20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>رصيدك الحالي: <strong style={{ color: '#0284c7' }}>\${userBalance.toFixed(2)}</strong></div>
          <div>تسعيرة الفحص: <strong style={{ color: 'red' }}>\${auditPrice.toFixed(2)}</strong></div>
          <div>أرباحك كمالك: <strong style={{ color: 'green' }}>\${adminEarnings.toFixed(2)}</strong></div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* زر شحن سريع مباشر ومستقر تماماً في التصميم */}
          <button onClick={handleQuickCryptoDeposit} style={{ padding: '8px 16px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
            🪙 شحن رصيد الكريبتو (+\$50)
          </button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🚪 خروج</button>
        </div>
      </div>

      <header style={{ padding: '20px 0', borderBottom: '1px solid #ccc', marginBottom: '25px', textAlign: 'center' }}>
        <h1>🛡️ Secure Contract AI</h1>
        <p style={{ color: '#666', margin: 0 }}>منصة التدقيق الأمني وفحص العقود الذكية بالذكاء الاصطناعي وبوابات دفع الـ Web3</p>
      </header>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>أدخل كود العقد الذكي (Solidity):</label>
        <textarea
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="قم بلصق كود عقدك الذكي هنا بالكامل لتجربة نظام الفحص والاقتطاع المالي..."
          style={{ width: '100%', height: '200px', padding: '15px', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button onClick={handleAudit} disabled={isLoading} style={{ flex: 1, padding: '14px', backgroundColor: isLoading ? '#94a3b8' : '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isLoading ? 'جاري الفحص واقتطاع المبلغ...' : `ابدأ التدقيق الأمني الفوري (تكلفة: \$${auditPrice})`}
        </button>
        <button onClick={() => { setContractText(''); setVulnerabilities([]); setHasSearched(false); }} style={{ padding: '14px 24px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          مسح
        </button>
      </div>

      {hasSearched && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>📊 نتائج التدقيق الإحصائية</h2>
            <button onClick={handleDownloadPDF} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📥 تحميل تقرير PDF</button>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', fontSize: '16px' }}>
            <div>🛡️ معدل الأمان: <strong style={{ color: score > 70 ? 'green' : 'red' }}>{score}%</strong></div>
            <div>🚨 ثغرات حرجة: <strong style={{ color: 'red' }}>{criticalCount}</strong></div>
            <div>⚠️ مشاكل عالية: <strong style={{ color: 'orange' }}>{highCount}</strong></div>
          </div>

          {vulnerabilities.length > 0 ? (
            <div>
              <h3>🔍 تفاصيل الأخطاء المكتشفة:</h3>
              {vulnerabilities.map((v, idx) => (
                <div key={idx} style={{ padding: '15px', marginBottom: '12px', borderRight: '5px solid #ef4444', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '5px' }}>{v.title || `[${v.severity}] ثغرة أمنية`}</strong>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>{v.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', padding: '20px' }}>🎉 العقد الذكي آمن تماماً وسليم! تم توريد الأرباح بنجاح!</div>
          )}
        </div>
      )}
    </main>
  );
}
