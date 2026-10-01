import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contractCode } = await request.json();

    if (!contractCode || contractCode.trim() === "") {
      return NextResponse.json({ error: 'يرجى لصق كود العقد الذكي أولاً لفحصه' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      return NextResponse.json({ error: 'إعدادات مفتاح الذكاء الاصطناعي مفقودة على السيرفر' }, { status: 500 });
    }

    // الـ Prompt الأمني الاحترافي لتوجيه خوارزميات الذكاء الاصطناعي للكشف الدقيق
    const systemPrompt = `You are an expert Web3 Smart Contract Auditor and Senior Security Engineer specialized in blockchain vulnerability research. Your task is to perform a rigorous security audit on the provided Solidity smart contract code.
    Analyze the code systematically for critical vulnerabilities like Reentrancy, Overflow, Access Control flaws, and Front-running.
    Provide your complete response formatted clearly in Markdown. Start with an OVERRIDE AUDIT SUMMARY with a security score (0 to 100), followed by DETAILED VULNERABILITIES with remediation code snippets. Maintain an elite, professional tone.`;

    // الاتصال بخوادم OpenAI الرسمية لمعالجة الكود بشكل فوري
    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // نموذج فائق الدقة البرمجية واقتصادي جداً
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please audit this contract code:\n\n${contractCode}` }
        ],
        temperature: 0.2 // درجة حرارة منخفضة لضمان أقصى درجات الصرامة والدقة وثبات النتائج
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData.error?.message || 'فشل الاتصال بمحرك الفحص الذكي' }, { status: 502 });
    }

    const data = await response.json();
    const auditResult = data.choices[0].message.content;

    return NextResponse.json({ success: true, result: auditResult });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
