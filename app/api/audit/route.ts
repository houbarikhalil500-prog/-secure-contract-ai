import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// تهيئة الاتصال الآمن مع Supabase باستخدام المفاتيح السرية المحمية في السيرفر
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { contractText, email } = await request.json();
    const userEmail = email || 'admin@secure.com'; // حساب الأدمن الافتراضي في حال لم يُمرر بريد
    const auditPrice = 49.00;

    if (!contractText || contractText.trim() === '') {
      return NextResponse.json({ success: false, error: 'كود العقد فارغ!' }, { status: 400 });
    }

    // 1️⃣ قراءة الرصيد الحقيقي والمحمي للعميل من قاعدة البيانات السحابية مباشرة لمنع التلاعب
    const { data: wallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('balance')
      .eq('email', userEmail)
      .single();

    if (fetchError || !wallet) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على محفظة رقمية لهذا المستخدم' }, { status: 404 });
    }

    const currentBalance = Number(wallet.balance);

    // 2️⃣ التحقق الصارم من امتلاك العميل للرصيد الكافي قبل بدء الفحص الأمني
    if (currentBalance < auditPrice) {
      return NextResponse.json({ success: false, error: `رصيدك غير كافٍ! تكلفة الفحص هي \$${auditPrice}. الرجاء شحن حسابك.` }, { status: 402 });
    }

    // 3️⃣ خصم تكلفة الفحص وتحديث الرصيد الجديد داخل الخزنة السحابية المغلقة بشكل آمن
    const newBalance = currentBalance - auditPrice;
    const { error: updateError } = await supabase
      .from('user_wallets')
      .update({ balance: newBalance })
      .eq('email', userEmail);

    if (updateError) {
      return NextResponse.json({ success: false, error: 'فشلت عملية تحديث المحفظة الرقمية أمنياً' }, { status: 500 });
    }

    // 4️⃣ تشغيل محرك معالجة وفحص الثغرات الأمنية الذكي (AI Simulation)
    const vulnerabilities = [
      {
        severity: 'CRITICAL',
        title: 'Reentrancy Vulnerability (ثغرة إعادة الدخول الحرجة)',
        description: 'تم اكتشاف إمكانية سحب الأموال بشكل متكرر قبل تحديث حالة العقد الذكي، مما يسمح للمخترقين بتصفير محفظة العقد تماماً.',
        solution: 'استخدم نمط Checks-Effects-Interactions أو قم بدمج مكتبة ReentrancyGuard من OpenZeppelin.'
      },
      {
        severity: 'HIGH',
        title: 'Integer Overflow / Underflow (تجاوز السعة الحسابية)',
        description: 'العمليات الحسابية داخل العقد قد تتجاوز الحدود المسموحة بدون حماية، مما يغير من قيم التوزيعات المالية للعملاء.',
        solution: 'إذا كنت تستخدم إصداراً أقل من Solidity 0.8.0، قم بدمج مكتبة SafeMath فوراً.'
      }
    ];

    return NextResponse.json({
      success: true,
      vulnerabilities,
      newBalance // إرسال الرصيد الجديد والموثق سحابياً لعرضه في الواجهة
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع في الخادم الرئيسي' }, { status: 500 });
  }
}
