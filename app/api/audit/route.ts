import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract || contract.trim() === "") {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    const contractCode = contract.toLowerCase();
    let vulnerabilities: any[] = [];

    // 1. فحص ثغرة Reentrancy
    if (contractCode.includes('.call{') || contractCode.includes('.transfer(') || contractCode.includes('.send(')) {
      if (contractCode.indexOf('balance') > contractCode.indexOf('.call') || contractCode.indexOf('balance') > contractCode.indexOf('.transfer')) {
        vulnerabilities.push({
          severity: 'CRITICAL',
          title: '🚨 ثغرة إعادة الدخول الحرجة (Reentrancy Vulnerability)',
          description: 'تم رصد إرسال للأموال (Ether) قبل تحديث أو تصفير رصيد المستخدم في خطوط الكود، مما يسمح للمهاجمين بسحب الأموال بشكل متكرر وتفريغ العقد.',
          solution: '💡 الحل: اتبع نمط (Checks-Effects-Interactions). قم بتحديث أرصدة المستخدمين وحالات العقد أولاً قبل تنفيذ أي عملية إرسال خارجي للأموال، أو استخدم مكتبة ReentrancyGuard من OpenZeppelin.'
        });
      }
    }

    // 2. فحص ثغرة Overflow / Underflow
    if (contractCode.includes('pragma solidity ^0.7') || contractCode.includes('pragma solidity 0.7') || contractCode.includes('pragma solidity ^0.6')) {
      if (!contractCode.includes('safemath')) {
        vulnerabilities.push({
          severity: 'HIGH',
          title: '⚠️ ثغرة التدفق الحسابي الزائد (Arithmetic Overflow/Underflow)',
          description: 'العقد يستخدم إصداراً قديماً من لغة Solidity أقل من 0.8.0 دون استيراد مكتبة الحماية SafeMath، مما يجعله عرضة للتلاعب بالحسابات وتجاوز الحدود الحسابية.',
          solution: '💡 الحل: قم بتحديث إصدار لغة Solidity في العقد إلى ^0.8.0 أو أعلى حيث تحتوي هذه الإصدارات على حماية حسابية مدمجة تلقائياً، أو قم باستيراد مكتبة SafeMath.'
        });
      }
    }

    // 3. فحص ثغرة tx.origin
    if (contractCode.includes('tx.origin')) {
      vulnerabilities.push({
          severity: 'MEDIUM',
          title: '⚠️ استخدام خاطئ لـ tx.origin للتحقق من الهوية',
          description: 'استخدام tx.origin للتحقق من الصلاحيات قد يعرض العقد لهجمات الخداع المباشرة والقرصنة عبر عقود وسيطة (Phishing Attacks).',
          solution: '💡 الحل: استبدل tx.origin بـ msg.sender للتحقق من هوية المستدعي المباشر للدالة بشكل آمن.'
      });
    }

    return NextResponse.json({ 
      success: true, 
      vulnerabilities: vulnerabilities
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في معالجة طلب الفحص." }, { status: 500 });
  }
}
