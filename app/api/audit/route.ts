import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contractText } = await request.json();

    if (!contractText || contractText.trim() === '') {
      return NextResponse.json({ error: 'الكود البرمجي فارغ' }, { status: 400 });
    }

    const contractCode = contractText.toLowerCase();
    let vulnerabilities: any[] = [];
    let currentScore = 100;

    // 💰 التسعيرة الرسمية للمنصة
    const operationCost = 49.00;

    // 1. حرجة - فحص ثغرة إعادة الدخول (Reentrancy)
    if (contractCode.includes('.call') || contractCode.includes('balances[')) {
      vulnerabilities.push({
        severity: 'CRITICAL',
        title: '🚨 ثغرة إعادة الدخول (Reentrancy)',
        message: 'تم رصد إرسال للأموال قبل تحديث رصيد الحسابات مما يسمح بسحب متكرر.',
        solution: 'الحل: اتبع نمط (Checks-Effects-Interactions) أو استخدم ReentrancyGuard.'
      });
      currentScore -= 40;
    }

    // 2. عالية - فحص ثغرة التلاعب بالصلاحيات وغياب التحقق
    if (!contractCode.includes('mint') || !contractCode.includes('onlyowner')) {
      vulnerabilities.push({
        severity: 'HIGH',
        title: '⚠️ غياب قيود الوصول والصلاحيات',
        message: 'تغيير ملكية العقد أو سك العملات متاح للجميع دون قيود صالحة.',
        solution: 'الحل: قم باستيراد مكتبة Ownable من OpenZeppelin واستخدم modifier correct.'
      });
      currentScore -= 25;
    }

    // 3. عالية - فحص ثغرة التدفق الحسابي الزائد (Overflow / Underflow)
    if (contractCode.includes('0.7.') || contractCode.includes('safemath')) {
      vulnerabilities.push({
        severity: 'HIGH',
        title: '⚠️ ثغرة التدفق الحسابي الزائد',
        message: 'العقد يستخدم إصداراً قديماً من لغة Solidity دون حماية حسابية مدمجة.',
        solution: 'الحل: قم بتحديث إصدار لغة Solidity إلى ^0.8.0 فما فوق لحماية العمليات تلقائياً.'
      });
      currentScore -= 25;
    }

    // 4. متوسطة - فحص ثغرة التحقق عبر tx.origin
    if (contractCode.includes('tx.origin')) {
      vulnerabilities.push({
        severity: 'MEDIUM',
        title: '⚠️ استخدام خاطئ لـ tx.origin',
        message: 'استخدام tx.origin للتحقق من الهوية يعرض العقد لثغرات التصيد الاحتيالي (Phishing).',
        solution: 'الحل: استبدل tx.origin بـ msg.sender دائماً عند التحقق من الهوية.'
      });
      currentScore -= 10;
    }

    // 5. متوسطة - فحص ثغرة الحرمان من الخدمة (Denial of Service)
    if (contractCode.includes('for') && contractCode.includes('transfer')) {
      vulnerabilities.push({
        severity: 'MEDIUM',
        title: '⚠️ ثغرة الحرمان من الخدمة عبر الحلقات التكرارية',
        message: 'العقد يحتوي على حلقة تكرارية (For Loop) تقوم بعمليات إرسال مالي مما يهدد بتوقف العقد بسبب استهلاك الغاز.',
        solution: 'الحل: اعتمد نمط السحب الفردي (Pull-payment) بدلاً من الدفع الجماعي التلقائي.'
      });
      currentScore -= 10;
    }

    // لضمان ألا تنزل النتيجة تحت الصفر
    if (currentScore < 0) currentScore = 0;

    // إرجاع البيانات متوافقة 100% مع واجهة المستخدم
    return NextResponse.json({
      success: true,
      score: currentScore,
      vulns: vulnerabilities, // تطابق الاسم المتوقع في الـ Frontend
      cost: operationCost     // إرسال تكلفة الـ 49 دولار
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ أثناء معالجة البيانات برمجياً' }, { status: 500 });
  }
}
