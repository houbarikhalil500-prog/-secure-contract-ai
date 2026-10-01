import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contract } = await request.json();

    if (!contract) {
      return NextResponse.json({ success: false, error: "نص العقد مفقود." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "مفتاح OPENAI_API_KEY غير معرف في إعدادات البيئة." 
      }, { status: 500 });
    }

    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير أمني محترف في فحص العقود الذكية وتحليل الثغرات البرمجية. قم بتحليل العقد المرسل باللغة العربية، واستخرج نقاط الضعف أو الثغرات الأمنية وقدم نصائح لإصلاحها بشكل نقاط واضحة ومختصرة.'
          },
          {
            role: 'user',
            content: contract
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message }, { status: 500 });
    }

    const aiText = data.choices?.[0]?.message?.content || "لم يتمكن الذكاء الاصطناعي من تحليل العقد، يرجى المحاولة لاحقاً.";

    return NextResponse.json({ 
      success: true, 
      message: aiText 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء الاتصال بنظام الذكاء الاصطناعي." }, { status: 500 });
  }
}
