"use client";

import React, { useState } from 'react';

export default function HomePage() {
  const [contractText, setContractText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const handleAudit = async () => {
    if (!contractText.trim()) {
      alert("الرجاء إدخال نص العقد أولاً!");
      return;
    }
    
    setIsLoading(true);
    setResultMessage('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract: contractText }),
      });
      const data = await response.json();
      if (data.success) {
        setResultMessage(data.message);
      } else {
        setResultMessage("فشل معالجة العقد.");
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f9',
      fontFamily: 'sans-serif',
      direction: 'rtl',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <header style={{
        textAlign: 'center',
        padding: '30px 10px',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🛡️ Secure Contract AI</h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>نظام فحص العقود الذكي وتحليل الثغرات</p>
      </header>

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#334155' }}>
            أدخل نص العقد الذكي هنا:
          </label>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="قم بلصق كود العقد أو النص هنا للبدء بالفحص..."
            style={{
              width: '100%',
              height: '180px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
              fontSize: '14px',
              marginBottom: '15px',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAudit}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isLoading ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'جاري الفحص والتحليل...' : '🔍 ابدأ فحص العقد'}
            </button>
            
            <button
              onClick={() => { setContractText(''); setResultMessage(''); }}
              style={{
                padding: '12px 20px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🗑️ مسح
            </button>
          </div>
        </div>

        {resultMessage && (
          <div style={{
            marginTop: '20px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#065f46', marginTop: 0 }}>📊 نتيجة الفحص المبدئي:</h3>
            <p style={{ color: '#047857', fontSize: '15px', margin: 0 }}>{resultMessage}</p>
          </div>
        )}
      </main>
    </div>
  );
}
