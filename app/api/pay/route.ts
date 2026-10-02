import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const response = await fetch('https://nowpayments.io', {
      method: 'POST',
      headers: {
        // ضع مفتاح الـ API الحقيقي الخاص بك من لوحة تحكم NOWPayments هنا
        'x-api-key': 'ضع_هنا_مفتاح_الـ_API_الخاص_بـ_NOWPayments', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: 49.00,
        price_currency: 'usd',
        pay_currency: body.cryptoCurrency || 'usdttrc20', // القيمة الافتراضية عملة USDT شبكة TRC-20
        order_id: `audit_${Date.now()}`, 
        order_description: 'Secure Contract AI - Code Audit Fee',
        ipn_callback_url: 'https://your-domain.com', // استبدل your-domain برابط موقعك الحقيقي لاحقاً
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
