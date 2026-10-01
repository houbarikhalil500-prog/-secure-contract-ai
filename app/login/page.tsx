"use client";

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("الرجاء ملء جميع الحقول!");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const registeredEmail = localStorage.getItem("registeredEmail");
      const registeredPassword = localStorage.getItem("registeredPassword");
      const registeredName = localStorage.getItem("registeredName") || "العميل الكريم";

      if (
        (email === "admin@secure.com" && password === "password123") ||
        (email === registeredEmail && password === registeredPassword)
      ) {
        localStorage.setItem("isLoggedIn", "true"); 
        alert(`تم تسجيل الدخول بنجاح! مرحباً بك يا ${registeredName}`);
        window.location.replace("/"); 
      } else {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <main style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#ffffff', color: '#333333' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>🔐 تسجيل الدخول للمنصة</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@secure.com"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoading ? 'جاري الدخول الفوري...' : 'تسجيل الدخول'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <span>ليس لديك حساب؟ </span>
        <button 
          onClick={() => window.location.href = '/register'} 
          style={{ background: 'none', border: 'none', color: '#34d399', fontWeight: 'bold', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
        >
          أنشئ حسابك الجديد من هنا
        </button>
      </div>
    </main>
  );
}
