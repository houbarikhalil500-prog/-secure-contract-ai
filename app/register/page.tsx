"use client";

import React, { useState } from 'react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("الرجاء ملء جميع الحقول المطلوبة!");
      return;
    }

    if (password !== confirmPassword) {
      alert("كلمة المرور وتأكيدها غير متطابقين!");
      return;
    }

    if (password.length < 6) {
      alert("يجب أن تكون كلمة المرور مكونة من 6 أحرف أو أكثر!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("registeredEmail", email);
      localStorage.setItem("registeredPassword", password);
      localStorage.setItem("registeredName", `${firstName} ${lastName}`);

      alert(`🎉 تم إنشاء الحساب بنجاح للعميل: ${firstName} ${lastName}\nسيتم توجيهك لصفحة الدخول!`);
      window.location.replace("/login");
    }, 1200);
  };

  return (
    <main style={{ maxWidth: '450px', margin: '60px auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#ffffff', color: '#333333' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>👤 إنشاء حساب جديد</h2>
      
      <form onSubmit={handleRegister}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الاسم الأول:</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="خليل"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اللقب (العائلة):</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              placeholder="البرمجي"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="khalil@example.com"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>تأكيد كلمة المرور:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333333' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#34d399', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isLoading ? 'جاري إنشاء الحساب...' : 'تسجيل وتدوين البيانات'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <span>لديك حساب بالفعل؟ </span>
        <button onClick={() => window.location.href = '/login'} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>تسجيل الدخول من هنا</button>
      </div>
    </main>
  );
}
