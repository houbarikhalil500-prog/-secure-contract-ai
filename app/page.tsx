'use client';

import { useState } from 'react';

// تعريف نوع البيانات القادمة من بوابة الدفع لمنع أخطاء الـ TypeScript
interface PaymentInfo {
  pay_amount: number;
  pay_address: string;
  payment_id: string;
}

export default function SecureContractDashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [solidityCode, setSolidityCode] = useState<string>('');

  // دالة طلب إنشاء الفاتورة من الخلفية وجلب عنوان الدفع
  const handleStartAudit = async () => {
    setLoading(true);
    setPaymentInfo(null); // إعادة تعيين الفاتورة عند كل طلب جديد
    
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cryptoCurrency: 'usdttrc20' }), // طلب الدفع بـ USDT (شبكة TRC-20)
      });
      
      const data = await res.json();
      if (res.ok) {
        setPaymentInfo(data);
      } else {
        alert(`فشل تجهيز الفاتورة: ${data.message || 'خطأ غير معروف'}`);
      }
    } catch (err) {
      alert('حدث خطأ أثناء الاتصال بالخادم، يرجى التحقق من الرابط والاتصال');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSolidityCode('');
    setPaymentInfo(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8" style={{ direction: 'rtl' }}>
      
      {/* 1. شريط معلومات الحساب والرصيد (العلوي) */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-xs text-gray-500">حسابك:</span>
          <span className="text-sm font-medium text-blue-600 font-mono">khalilhabari33@gmail.com</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-xs text-gray-500 block">تسعيرة الفحص:</span>
            <span className="text-sm font-bold text-red-500 font-mono">49.00\$</span>
          </div>
          <div className="text-center border-r pr-6 border-gray-200">
            <span className="text-xs text-gray-500 block">أرباحك كمالك:</span>
            <span className="text-sm font-bold text-green-600 font-mono">0.00\$</span>
          </div>
        </div>

        {/* زر شحن رصيد الكريبتو البرتقالي */}
        <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1">
          🌐 شحن رصيد الكريبتو (+50\$)
        </button>
      </div>

      {/* 2. عنوان المنصة الرئيسي والوصف */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2 mb-2">
          Secure Contract AI 🛡️
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          منصة التدقيق الأمني وفحص العقود الذكية بالذكاء الاصطناعي وبوابات دفع الـ Web3 المحمية سحابياً.
        </p>
      </div>

      {/* 3. صندوق إدخال كود الـ Solidity وعناصر التحكم */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            أدخل كود العقد الذكي (Solidity):
          </label>
          <textarea
            value={solidityCode}
            onChange={(e) => setSolidityCode(e.target.value)}
            placeholder="قم بلصق كود عقدك الذكي هنا بالكامل لتجربة نظام الفحص والاقتطاع المالي الحقيقي من قاعدة البيانات..."
            className="w-full h-64 p-4 rounded-xl border border-gray-200 bg-gray-50 font-mono text-xs text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none shadow-inner"
            style={{ direction: 'ltr' }}
          />
        </div>

        {/* أزرار التحكم (التدقيق ومسح الكود) */}
        <div className="flex gap-3">
          <button 
            onClick={handleStartAudit}
            disabled={loading}
            className="flex-1 bg-[#0070f3] hover:bg-[#0051cb] disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-xl text-base transition-all shadow-sm"
          >
            {loading ? 'جاري إنشاء عنوان الدفع الآمن...' : 'ابدأ التدقيق الأمني الفوري (تكلفة: 49\$)'}
          </button>
          
          <button 
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 rounded-xl text-sm transition-all"
          >
            مسح
          </button>
        </div>

        {/* 4. صندوق الفاتورة الذكي (يظهر تلقائياً للزبون فور الضغط وجلب البيانات) */}
        {paymentInfo && (
          <div className="w-full p-5 rounded-xl border border-green-100 bg-green-50/50 text-right shadow-inner transition-all animate-fadeIn">
            <p className="font-bold text-green-700 text-sm mb-3 flex items-center gap-1">
              🔒 تم توليد محفظة دفع آمنة بنجاح عبر NOWPayments
            </p>
            
            <div className="mb-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-500 block text-xs">المبلغ المطلوب إرساله بدقة:</span>
              <strong className="text-lg font-mono text-blue-700 block mt-0.5">{paymentInfo.pay_amount} USDT</strong>
            </div>
            
            <div className="mb-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <span className="text-gray-500 block text-xs">أرسل المبلغ إلى عنوان الشبكة التالي (TRC-20):</span>
              <div className="bg-gray-50 p-2.5 rounded border border-gray-200 select-all font-mono text-xs break-all mt-1.5 text-left text-gray-800 shadow-inner">
                {paymentInfo.pay_address}
              </div>
              <small className="text-gray-400 block Regal text-[10px] mt-1">* يمكنك نسخ العنوان أعلاه بالكامل للتحويل من محفظتك الفردية أو عبر المنصات كـ Binance.</small>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 leading-relaxed">
              بمجرد إرسال المعاملة على البلوكشين، سيقوم نظام الويب هوك لدينا بالتحقق تلقائياً، لتبدأ خوارزمية الذكاء الاصطناعي بفحص كود الـ Solidity وعرض التقرير فوراً.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
