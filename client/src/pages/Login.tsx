import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { MessageSquare } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ai_3oman</h1>
          <p className="text-muted-foreground">
            منصة الذكاء الاصطناعي في عمان
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            أهلاً وسهلاً
          </h2>
          <p className="text-muted-foreground mb-8">
            قم بتسجيل الدخول للوصول إلى جميع الميزات
          </p>

          <a href={getLoginUrl()}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold">
              تسجيل الدخول عبر Manus
            </Button>
          </a>

          <p className="text-xs text-muted-foreground text-center mt-6">
            بتسجيل الدخول، فإنك توافق على شروط الخدمة وسياسة الخصوصية
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-xs text-muted-foreground">دردشة ذكية</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎨</div>
            <p className="text-xs text-muted-foreground">توليد صور</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-xs text-muted-foreground">أتمتة مهام</p>
          </div>
        </div>
      </div>
    </div>
  );
}
