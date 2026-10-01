import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract) {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    // قراءة المفتاح المجاني من إعدادات فيرسيل
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "مفتاح GEMINI_API_KEY غير معرف في إعدادات المنصة." 
      }, { status: 500 });
    }

    // الاتصال المباشر بخوادم Google Gemini AI المجانية والسريعة
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `أنت خبير أمني محترف ومستشار أمان في فحص العقود الذكية وتحليل الثغرات البرمجية. قم بتحليل العقد المرسل باللغة العربية، واستخرج نقاط الضعف أو الثغرات الأمنية وقدم نصائح دقيقة وإصلاحات برمجية واضحة ومختصرة في نقاط:\n\n${contract}`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتمكن الذكاء الاصطناعي من تحليل العقد حالياً.";

    return NextResponse.json({ 
      success: true, 
      message: aiText 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في معالجة طلب الفحص الذكي." }, { status: 500 });
  }
}
