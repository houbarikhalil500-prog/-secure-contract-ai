import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contractText } = await request.json();

    if (!contractText || contractText.trim() === '') {
      return NextResponse.json({ error: 'الكود البرمجي فارغ' }, { status: 400 });
    }

    const operationCost = 49.00; // تكلفة الفحص المقررة تزامناً مع الواجهة
    const hasTxOrigin = contractText.includes('tx.origin');
    const hasReentrancy = contractText.includes('.call{value:');

    const detectedVulnerabilities = [];

    if (hasTxOrigin) {
      detectedVulnerabilities.push({
        severity: 'HIGH',
        title: 'ثغرة التصيد الاحتيالي (tx.origin Phishing)',
        description: 'استخدام tx.origin للتحقق من هوية المالك يعرض محفظتك وثغرات العقد لعمليات التصيد الاحتيالي الذكية من عقود خارجية.',
        solution: 'استبدل tx.origin بـ msg.sender لضمان التحقق الآمن من الهوية.'
      });
    }

    if (hasReentrancy) {
      detectedVulnerabilities.push({
        severity: 'CRITICAL',
        title: 'ثغرة إعادة الدخول (Reentrancy)',
        description: 'يتم إرسال العملات أو تفعيل العقود الخارجية قبل تصفير أو تحديث حالة أرصدة المستخدمين في العقد.',
        solution: 'قم بتحديث حالة الحسابات والأرصدة أولاً قبل إجراء أي عملية نقل أموال خارجية.'
      });
    }

    return NextResponse.json({
      success: true,
      vulnerabilities: detectedVulnerabilities,
      cost: operationCost
    });

  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع أثناء معالجة العقد برمجياً' }, { status: 500 });
  }
}
