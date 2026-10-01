import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'المبلغ غير صحيح' }, { status: 400 });
    }

    // جلب المفتاح السري الذي قمنا بتخزينه مسبقاً لحماية حسابك
    const apiKey = process.env.NOWPAYMENTS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح الـ API غير معرف في السيرفر' }, { status: 500 });
    }

    // إرسال طلب آمن إلى NOWPayments لإنشاء الفاتورة الرقمية الحقيقية
    const response = await fetch('https://nowpayments.io', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: Number(amount),
        price_currency: 'usd',
        pay_currency: 'usdttrc20', // الدفع الافتراضي المستقر والمحبوب عبر شبكة ترون (USDT-TRC20)
        ipn_callback_url: `https://${process.env.VERCEL_URL}/api/pay/callback`, // لتحديث رصيد المستخدم آلياً بعد الدفع
        order_description: 'شحن رصيد محفظة تدقيق العقود الذكية Secure Contract AI'
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      payment_id: data.payment_id,
      pay_address: data.pay_address, // عنوان المحفظة الرقمية المؤقت الذي يجب على العميل الإرسال إليه
      pay_amount: data.pay_amount,   // كمية الـ USDT المطلوبة بدقة شاملة الرسوم
    });

  } catch (error) {
    return NextResponse.json({ error: 'فشل في الاتصال ببوابة الدفع الرقمية' }, { status: 500 });
  }
}
