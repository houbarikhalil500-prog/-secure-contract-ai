import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: "تم استلام البيانات بنجاح لبدء الفحص والتأمين.",
      receivedData: data 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء معالجة الطلب." 
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "مستعد", 
    endpoint: "/api/audit" 
  });
}
