import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  MessageSquare, 
  Sparkles, 
  Image as ImageIcon, 
  CheckSquare, 
  ArrowRight,
  Shield,
  Zap,
  Cpu
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            مستقبل الذكاء الاصطناعي في عمان
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            اكتشف قدرات <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">ai_3oman</span> اللامحدودة
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            منصة متكاملة تجمع بين المحادثات الذكية، توليد الصور، وإدارة المهام المتقدمة في واجهة واحدة متطورة وسهلة الاستخدام.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg" className="h-14 px-8 text-lg font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                ابدأ الآن مجاناً
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold hover:bg-secondary">
                تواصل معنا
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-foreground">ميزات متقدمة لكل احتياجاتك</h2>
            <p className="text-muted-foreground">كل ما تحتاجه للإنتاجية والإبداع في مكان واحد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chat Feature */}
            <div className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">محادثات ذكية</h3>
              <p className="text-muted-foreground leading-relaxed">
                تفاعل مع نموذجنا اللغوي المتقدم للحصول على إجابات دقيقة، كتابة محتوى، أو حل مشكلات معقدة.
              </p>
            </div>

            {/* Image Feature */}
            <div className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">توليد وتحرير الصور</h3>
              <p className="text-muted-foreground leading-relaxed">
                حول أفكارك إلى صور واقعية مذهلة أو قم بتحرير الصور الحالية بلمسات إبداعية ذكية.
              </p>
            </div>

            {/* Tasks Feature */}
            <div className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">إدارة المهام</h3>
              <p className="text-muted-foreground leading-relaxed">
                نظم جدولك وأتمت مهامك اليومية بسهولة مع نظام المراقبة والجدولة المدمج.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              <p className="font-bold">سرعة فائقة</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <p className="font-bold">أمان تام</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Cpu className="w-8 h-8 text-primary" />
              <p className="font-bold">تقنيات حديثة</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <p className="font-bold">إبداع مستمر</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-12 px-4 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ai_3oman</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 جميع الحقوق محفوظة لـ ai_3oman
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">تواصل معنا</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">الخصوصية</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
