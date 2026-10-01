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

    // 1. التحقق من ملء جميع الحقول
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("الرجاء ملء جميع الحقول المطلوبة!");
      return;
    }

    // 2. التحقق من تطابق كلمة المرور وتأكيدها
    if (password !== confirmPassword) {
      alert("كلمة المرور وتأكيدها غير متطابقين!");
      return;
    }

    // 3. التحقق من طول كلمة المرور للأمان
    if (password.length < 6) {
      alert("يجب أن تكون كلمة المرور مكونة من 6 أحرف أو أكثر!");
      return;
    }

    setIsLoading(true);

    // محاكاة تسجيل الحساب بنجاح وتوجيه المستخدم لتفعيل البريد أو الدخول
    setTimeout(() => {
      // حفظ بيانات المستخدم مؤقتاً في المتصفح لتجربتها حياً
      localStorage.setItem("registeredEmail", email);
      localStorage.setItem("registeredPassword", password);
      localStorage.setItem("registeredName", `${firstName} ${lastName}`);

      alert(`🎉 تم إنشاء الحساب بنجاح للعميل: ${firstName} ${lastName}\nسيتم إرسال رابط التحقق إلى بريدك الإلكتروني قريباً!`);
      
      // نقله تلقائياً لصفحة تسجيل الدخول ليدخل بحسابه الجديد
      window.location.replace("/login");
    }, 1200);
  };

  return (
    <main style={{ maxWidth: '450px', margin: '60px auto', padding: '30px', direction: 'rtl', fontFamily: 'system-ui, sans-serif', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>👤 إنشاء حساب جديد</h2>
      
      <form onSubmit={handleRegister}>
        {/* خانة الاسم واللقب متجاورين */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الاسم الأول:</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="خليل"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اللقب (العائلة):</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              placeholder="البرمجي"
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        {/* خانة البريد الإلكتروني */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="khalil@example.com"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {/* خانة كلمة المرور */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {/* خانة تأكيد كلمة المرور */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>تأكيد كلمة المرور:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#34d399', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          {isLoading ? 'جاري إنشاء الحساب...' : 'تسجيل وتدوين البيانات'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        <span>لديك حساب بالفعل؟ </span>
        <a href="/login" style={{ color: '#0284c7', fontWeight: 'bold', textDecoration: 'none' }}>تسجيل الدخول من هنا</a>
      </div>
    </main>
  );
}
