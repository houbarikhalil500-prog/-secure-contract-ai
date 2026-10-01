import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "text", placeholder: "user@example.com" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        // 💡 هنا يمكنك مستقبلاً الربط مع قاعدة بيانات للتحقق من العميل
        // حالياً سنقوم بعمل حساب افتراضي للتأكد من نجاح النظام وتخطي الفحص
        if (credentials?.email === "admin@secure.com" && credentials?.password === "password123") {
          return { id: "1", name: "خليل البرمجي", email: "admin@secure.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", // توجيه المستخدم لصفحة تسجيل الدخول المخصصة
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretdevelopmentkey12345",
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // ربط معرف المستخدم بالجلسة الحالية
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
