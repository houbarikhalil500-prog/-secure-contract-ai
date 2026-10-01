import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract) {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    // سنقرأ المفتاح الجديد الذي سنضعه في فيرسيل باسم GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "مفتاح GEMINI_API_KEY غير معرف." 
      }, { status: 500 });
    }

    // الاتصال بخوادم جوجل جيميني المجانية والسريعة
    const response = await fetch(`https://googleapis.com{apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `أنت خبير أمني محترف في فحص العقود الذكية وتحليل الثغرات البرمجية. قم بتحليل العقد المرسل باللغة العربية، واستخرج نقاط الضعف أو الثغرات الأمنية وقدم نصائح لإصلاحها بشكل نقاط واضحة ومختصرة:\n\n${contract}`
          }]
        }]
      })
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "لم يتمكن الذكاء الاصطناعي من تحليل العقد.";

    return NextResponse.json({ 
      success: true, 
      message: aiText 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في معالجة الطلب." }, { status: 500 });
  }
}
