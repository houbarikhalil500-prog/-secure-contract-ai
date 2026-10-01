import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract || contract.trim() === "") {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    const contractCode = contract.toLowerCase();
    let vulnerabilities: any[] = [];

    // 1. فحص ثغرة إعادة الدخول (Reentrancy)
    if (contractCode.includes('.call{') || contractCode.includes('.transfer(') || contractCode.includes('.send(')) {
      if (contractCode.indexOf('balance') > contractCode.indexOf('.call') || contractCode.indexOf('balance') > contractCode.indexOf('.transfer')) {
        vulnerabilities.push({
          severity: 'CRITICAL',
          title: '🚨 ثغرة إعادة الدخول الحرجة (Reentrancy Vulnerability)',
          description: 'تم رصد إرسال للأموال (Ether) قبل تحديث أو تصفير رصيد المستخدم في خطوط الكود، مما يسمح للمهاجمين بسحب الأموال بشكل متكرر وتفريغ محفظة العقد.',
          solution: '💡 الحل: اتبع نمط (Checks-Effects-Interactions). قم بتحديث أرصدة المستخدمين وحالات العقد أولاً قبل تنفيذ أي عملية إرسال خارجي للأموال، أو استخدم مكتبة ReentrancyGuard من OpenZeppelin.'
        });
      }
    }

    // 2. فحص ثغرة التلاعب بالصلاحيات وغياب التحقق (Access Control)
    if (contractCode.includes('function ') && (contractCode.includes('owner =') || contractCode.includes('mint(') || contractCode.includes('burn('))) {
      if (!contractCode.includes('onlyowner') && !contractCode.includes('require(msg.sender ==') && !contractCode.includes('_checkowner')) {
        vulnerabilities.push({
          severity: 'HIGH',
          title: '⚠️ غياب قيود الوصول والصلاحيات (Missing Access Control)',
          description: 'تم العثور على دالة حساسة تقوم بتغيير ملكية العقد أو صك العملات (Mint) دون وجود محدد صلاحيات مثل (onlyOwner)، مما يسمح لأي مستخدم خارجي بالتحكم الكامل بالعقد وسرقة الصلاحيات.',
          solution: '💡 الحل: قم باستيراد مكتبة Ownable من OpenZeppelin وأضف محدد الصلاحية `onlyOwner` لجميع الدوال الحساسة لمنع غير الملاك من استدعائها.'
        });
      }
    }

    // 3. فحص ثغرة التدفق الحسابي الزائد (Overflow / Underflow)
    if (contractCode.includes('pragma solidity ^0.7') || contractCode.includes('pragma solidity 0.7') || contractCode.includes('pragma solidity ^0.6')) {
      if (!contractCode.includes('safemath')) {
        vulnerabilities.push({
          severity: 'HIGH',
          title: '⚠️ ثغرة التدفق الحسابي الزائد (Arithmetic Overflow/Underflow)',
          description: 'العقد يستخدم إصداراً قديماً من لغة Solidity أقل من 0.8.0 دون استيراد مكتبة الحماية SafeMath، مما يجعله عرضة للتلاعب بالحسابات وتجاوز الحدود الرياضية للعدادات.',
          solution: '💡 الحل: قم بتحديث إصدار لغة Solidity في العقد إلى ^0.8.0 أو أعلى حيث تحتوي هذه الإصدارات على حماية حسابية مدمجة تلقائياً، أو قم باستيراد مكتبة SafeMath.'
        });
      }
    }

    // 4. فحص ثغرة التحقق عبر tx.origin
    if (contractCode.includes('tx.origin')) {
      vulnerabilities.push({
          severity: 'MEDIUM',
          title: '⚠️ استخدام خاطئ لـ tx.origin للتحقق من الهوية',
          description: 'استخدام tx.origin للتحقق من الصلاحيات يعرض العقد لهجمات الاختراق الوسيطة والخداع المباشر (Phishing Attacks) عبر تصيد توقيع المالك الأصل.',
          solution: '💡 الحل: استبدل tx.origin بـ `msg.sender` للتحقق من هوية المستدعي المباشر للدالة بشكل آمن.'
      });
    }

    // 5. فحص ثغرة القفل اللانهائي (Denial of Service - DoS)
    if (contractCode.includes('for (') && contractCode.includes('.length')) {
      if (contractCode.includes('.push(') || contractCode.includes('mapping')) {
        vulnerabilities.push({
          severity: 'MEDIUM',
          title: '⚠️ خطر الحرمان من الخدمة عبر الحلقات التكرارية (DoS via Loop)',
          description: 'العقد يحتوي على حلقة تكرارية (For Loop) تعتمد على طول مصفوفة ديناميكية متغيرة الحجم، إذا كبر حجم المصفوفة بشكل ضخم ستستهلك الدالة كل غاز الشبكة (Gas) وتتوقف عن العمل للأبد وتجمد الأموال بداخلها.',
          solution: '💡 الحل: تجنب عمل حلقات تكرارية على مصفوفات تنمو بشكل غير محدود، واستبدل النمط بنظام السحب الفردي أو تحديد حد أقصى (Max Limit) لحجم المصفوفة.'
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      vulnerabilities: vulnerabilities
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في معالجة طلب الفحص الشامل." }, { status: 500 });
  }
}
