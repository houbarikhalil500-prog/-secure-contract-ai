'use client';

import { useState } from 'react';

export default function SecureContractDashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solidityCode, setSolidityCode] = useState<string>('');
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // السعر بالدولار الأمريكي
  const AUDIT_FEE_USD = 149.00; 

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        setLoading(true);
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        alert('Wallet connection failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask or Trust Wallet to connect.');
    }
  };

  const handleStartAudit = async () => {
    if (!walletAddress) {
      alert('Please connect your Web3 wallet first!');
      return;
    }
    if (!solidityCode.trim()) {
      alert('Please paste your Solidity smart contract code first.');
      return;
    }

    setLoading(true);
    setAuditResult(null);
    
    try {
      // 1. حساب قيمة الدفع الفعلية
      // ملاحظة: لتحويل الـ USD إلى قيمة ETH دقيقة برمجياً، يُفضل استخدام Price Feed (مثل Chainlink Data Feeds) 
      // أو حسابها من خادمك الخاص (Backend). القيمة أدناه تقريبية للتوضيح (مثلاً 0.04 ETH).
      const ethAmountInWei = '0x8e1bc9bf040000'; // ما يعادل تقريباً قيمة الـ 149$ بالـ ETH حالياً

      const transactionParameters = {
        to: '0x5b7a146a9e3c4bd2752b499fa1dddee26981fe24', // عنوان محفظة استقبال أرباح موقعك
        from: walletAddress,
        value: ethAmountInWei, // القيمة الفعلية الصحيحة
      };

      // طلب إرسال المعاملة الحقيقية من محفظة العميل
      const txHash = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      if (txHash) {
        setAuditResult('⏳ Payment confirmed! Analyzing your smart contract for vulnerabilities...');

        // 2. استدعاء خادمك الخاص (Backend API) بشكل آمن لاستدعاء الذكاء الاصطناعي
        // لا تقم باستدعاء الـ API الخاص بـ Google أو OpenAI من الـ Frontend مباشرة لحماية مفاتيحك السرية (API Keys)
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: solidityCode, txHash: txHash })
        });

        const data = await response.json();
        
        if (data.success && data.report) {
          setAuditResult(data.report);
        } else {
          setAuditResult('❌ Audit failed. Please contact support with your Transaction Hash.');
        }
      }
    } catch (err) {
      alert('Transaction canceled or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSolidityCode('');
    setAuditResult(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* شريط الاتصال العلوي */}
      <div style={{ width: '100%', maxWidth: '896px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', flexWrap: 'wrap', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Network Connection</span>
          {walletAddress ? (
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#059669', fontWeight: 'bold', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '12px', marginTop: '4px' }}>
              🟢 Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </span>
          ) : (
            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 'bold', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '12px', marginTop: '4px' }}>
              🔴 Disconnected
            </span>
          )}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Audit Fee</span>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb', fontFamily: 'monospace', marginTop: '2px', display: 'block' }}>${AUDIT_FEE_USD.toFixed(2)}</span>
        </div>

        <button 
          onClick={connectWallet}
          disabled={loading}
          style={{ fontWeight: 'bold', padding: '12px 24px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.3s', border: 'none', color: '#ffffff', background: walletAddress ? 'linear-gradient(to right, #10b981, #059669)' : 'linear-gradient(to right, #2563eb, #1d4ed8)' }}
        >
          {walletAddress ? '✓ Wallet Connected' : '🌐 Connect Wallet'}
        </button>
      </div>

      {/* عنوان الصفحة ووصف الخدمة */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', marginBottom: '12px' }}>
          Secure Contract AI
        </h1>
        <p style={{ fontSize: '13px', color: '#4b5563', maxWidth: '448px', margin: '0 auto', lineHeight: '1.6', padding: '0 8px' }}>
          Analyze your smart contract vulnerabilities instantly with advanced cyber AI models through secure decentralized Web3 checkout.
        </p>
      </div>

      {/* صندوق إدخال الكود والنتائج */}
      <div style={{ width: '100%', maxWidth: '896px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box' }}>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 4px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>
              Paste Smart Contract Code (Solidity):
            </label>
            <span style={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}>.sol</span>
          </div>
          
          <textarea
            value={solidityCode}
            onChange={(e) => setSolidityCode(e.target.value)}
            placeholder="// Paste your Solidity code here..."
            style={{ width: '100%', height: '288px', padding: '16px', borderRadius: '16px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontFamily: 'monospace', fontSize: '12px', color: '#1f2937', textAlign: 'left', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleStartAudit}
            disabled={loading}
            style={{ flex: 2, padding: '14px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', color: '#ffffff', backgroundColor: '#2563eb', transition: 'background-color 0.2s' }}
          >
            {loading ? 'Processing...' : '🔒 Pay & Start AI Audit'}
          </button>
          
          <button 
            onClick={handleClear}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid #d1d5db', cursor: 'pointer', color: '#4b5563', backgroundColor: '#ffffff' }}
          >
            Clear
          </button>
        </div>

        {/* عرض نتيجة الفحص للعميل */}
        {auditResult && (
          <div style={{ marginTop: '16px', padding: '20px', borderRadius: '16px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>Audit Report Output:</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{auditResult}</pre>
          </div>
        )}

      </div>
    </div>
  );
}
      
