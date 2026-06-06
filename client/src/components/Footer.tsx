import { Mail, Phone, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-sidebar-foreground mb-4">
              عن ai_3oman
            </h3>
            <p className="text-sm text-muted-foreground">
              منصة ذكية للحوار والاستشارة باستخدام تقنيات الذكاء الاصطناعي المتقدمة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sidebar-foreground mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  التواصل
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  سياسة الخصوصية
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sidebar-foreground mb-4">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href="mailto:wolfonlyoman@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  wolfonlyoman@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href="tel:+96872424324"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +96872424324
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                <a
                  href="https://t.me/a3b6iii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  @a3b6iii
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            جميع الحقوق محفوظة © {currentYear} ai_3oman. تم التطوير بعناية.
          </p>
        </div>
      </div>
    </footer>
  );
}
