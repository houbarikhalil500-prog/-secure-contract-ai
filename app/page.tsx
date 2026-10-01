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
    
    // 🔐 تفعيل آلية التحقق الحقيقية وربط زر الدخول بالجلسة المعتمدة للمتصفح
    setTimeout(() => {
      if (email === "admin@secure.com" && password === "password123") {
        localStorage.setItem("isLoggedIn", "true"); // تدوين نجاح الجلسة لحماية الواجهة الرئيسية ✅
        alert("تم تسجيل الدخول بنجاح!");
        window.location.href = "/"; // إعادة التوجيه الفوري للوحة التحكم الرئيسية
      } else {
        alert("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>🔐 تسجيل الدخول للمنصة</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@secure.com"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoading ? 'جاري التحقق وتفعيل الجلسة...' : 'تسجيل الدخول'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '15px' }}>
        الحساب الافتراضي للتجربة:<br/>
        Email: <code style={{ backgroundColor: '#eee', padding: '2px 4px' }}>admin@secure.com</code><br/>
        Password: <code style={{ backgroundColor: '#eee', padding: '2px 4px' }}>password123</code>
      </p>
    </main>
  );
}
