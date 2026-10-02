import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const paymentData = await req.json();

    // التحقق من أن بوابة NOWPayments تؤكد اكتمال عملية الدفع بنجاح
    if (paymentData.payment_status === 'finished') {
      console.log(`تم تأكيد الدفع بنجاح للطلب رقم: ${paymentData.order_id}`);
      
      // 🚀 هنا تضع الأمر البرمجي الخاص بموقعك لتفعيل فحص كود الـ Solidity وإعطاء النتيجة للزبون
      
      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    return NextResponse.json({ status: 'waiting' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
