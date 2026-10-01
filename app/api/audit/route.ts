import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract || contract.trim() === "") {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    const contractCode = contract.toLowerCase();
    let vulnerabilities: string[] = [];
    let recommendations: string[] = [];

    // 1. الفحص التلقائي لثغرة Reentrancy
    if (contractCode.includes('.call{') || contractCode.includes('.transfer(') || contractCode.includes('.send(')) {
      if (contractCode.indexOf('balance') > contractCode.indexOf('.call') || contractCode.indexOf('balance') > contractCode.indexOf('.transfer')) {
        vulnerabilities.push("🚨 **ثغرة إعادة الدخول الحرجة (Reentrancy Vulnerability):** تم رصد إرسال للأموال (Ether) قبل تحديث أو تصفير رصيد المستخدم في خطوط الكود، مما يسمح للمهاجمين بسحب الأموال بشكل متكرر.");
        recommendations.push("💡 **الحل:** اتبع نمط (Checks-Effects-Interactions). قم بتحديث أرصدة المستخدمين وحالات العقد أولاً قبل تنفيذ أي عملية إرسال خارجي للأموال، أو استخدم مكتبة ReentrancyGuard من OpenZeppelin.");
      }
    }

    // 2. الفحص التلقائي لثغرة Overflow / Underflow
    if (contractCode.includes('pragma solidity ^0.7') || contractCode.includes('pragma solidity 0.7') || contractCode.includes('pragma solidity ^0.6')) {
      if (!contractCode.includes('safemath')) {
        vulnerabilities.push("⚠️ **ثغرة التدفق الحسابي الزائد (Arithmetic Overflow/Underflow):** العقد يستخدم إصداراً قديماً من لغة Solidity أقل من 0.8.0 دون استيراد مكتبة الحماية SafeMath، مما يجعله عرضة للتلاعب بالحسابات وتصفير العدادات الزوجية.");
        recommendations.push("💡 **الحل:** قم بتحديث إصدار لغة Solidity في العقد إلى `^0.8.0` أو أعلى حيث تحتوي هذه الإصدارات على حماية حسابية مدمجة تلقائياً، أو قم باستيراد واستخدام مكتبة SafeMath.");
      }
    }

    // 3. الفحص التلقائي للصلاحيات والملاك
    if (contractCode.includes('tx.origin')) {
      vulnerabilities.push("⚠️ **استخدام خاطئ لـ tx.origin للتحقق من الهوية:** استخدام tx.origin قد يعرض العقد لهجمات الخداع المباشرة (Phishing Attacks).");
      recommendations.push("💡 **الحل:** استبدل tx.origin بـ `msg.sender` للتحقق من هوية المستدعي المباشر للدالة بشكل آمن.");
    }

    // تجميع التقرير النهائي
    let finalMessage = "";
    if (vulnerabilities.length > 0) {
      finalMessage = "📊 **تقرير الفحص الأمني الذكي للـ AI:**\n\n" + vulnerabilities.join("\n\n") + "\n\n" + recommendations.join("\n\n");
    } else {
      finalMessage = "✅ **تقرير الفحص الأمني الذكي للـ AI:**\n\nلم يتم العثور على ثغرات أمنية واضحة وشائعة في هذا الكود. العقد يبدو آمناً مبدئياً بناءً على القواعد القياسية للفحص المبدئي.";
    }

    return NextResponse.json({ 
      success: true, 
      message: finalMessage 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في معالجة طلب الفحص." }, { status: 500 });
  }
}
