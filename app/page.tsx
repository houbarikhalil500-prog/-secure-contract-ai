'use client';

import { useState } from 'react';

// تعريف نوع البيانات القادمة من البوابة لمنع أخطاء الـ TypeScript
interface PaymentInfo {
  pay_amount: number;
  pay_address: string;
  payment_id: string;
}

export default function AuditComponent() {
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const handleStartAudit = async () => {
    setLoading(true);
    setPaymentInfo(null); // إعادة تعيين البيانات مع كل عملية جديدة
    
    try {
      // استدعاء ملف الـ API الذي أنشأناه في مجلد app/api/pay
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cryptoCurrency: 'usdttrc20' }), // طلب الدفع بـ USDT عبر شبكة ترون منخفضة الرسوم
      });
      
      const data = await res.json();
      if (res.ok) {
        setPaymentInfo(data);
      } else {
        alert(`فشل تجهيز الفاتورة: ${data.message || 'خطأ غير معروف'}`);
      }
    } catch (err) {
      alert('حدث خطأ أثناء الاتصال بالخادم، يرجى التحقق من الرابط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      
      {/* الزر الأزرق الرئيسي (ابدأ التدقيق الفوري) */}
      <button 
        onClick={handleStartAudit} 
        disabled={loading}
        className="w-full bg-[#0070f3] hover:bg-[#0051cb] text-white font-bold py-4 px-6 rounded-lg text-lg transition-all"
      >
        {loading ? 'جاري إنشاء عنوان الدفع الآمن...' : 'ابدأ التدقيق الفوري (تكلفة: 49\$)'}
      </button>

      {/* صندوق عرض تفاصيل المحفظة والمبلغ للزبون فور توليد الفاتورة */}
      {paymentInfo && (
        <div className="w-full p-5 rounded-lg border border-gray-200 bg-gray-50 text-right shadow-sm" style={{ direction: 'rtl' }}>
          <p className="font-bold text-green-600 text-base mb-3">🔒 تم توليد محفظة دفع آمنة بنجاح</p>
          
          <div className="mb-2">
            <span className="text-gray-600 block text-sm">المبلغ المطلوب إرساله بدقة:</span>
            <strong className="text-xl font-mono text-blue-700 block mt-1">{paymentInfo.pay_amount} USDT</strong>
          </div>
          
          <div className="mb-3">
            <span className="text-gray-600 block text-sm">أرسل المبلغ إلى عنوان الشبكة (TRC-20):</span>
            <div className="bg-white p-3 rounded border border-gray-300 select-all font-mono text-xs break-all mt-1 shadow-inner text-left">
              {paymentInfo.pay_address}
            </div>
            <small className="text-gray-400 block text-xs mt-1">* يمكنك الضغط مرتين على العنوان أعلاه لنسخه بالكامل.</small>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 leading-relaxed">
            بمجرد قيامك بالتحويل من محفظتك الإلكترونية، سيقوم النظام بالتحقق تلقائياً من الشبكة، وستبدأ عملية فحص عقد الـ Solidity فوراً وتحديث حسابك.
          </div>
        </div>
      )}

    </div>
  );
}
