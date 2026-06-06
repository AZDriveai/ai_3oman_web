import { Button } from "@/components/ui/button";
import { Mail, Phone, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Design Philosophy: Modern Minimalist
 * - Contact page with clean layout
 * - Contact information prominently displayed
 * - Simple contact form
 */

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "wolfonlyoman@gmail.com",
      href: "mailto:wolfonlyoman@gmail.com",
    },
    {
      icon: Phone,
      label: "الهاتف",
      value: "+96872424324",
      href: "tel:+96872424324",
    },
    {
      icon: Send,
      label: "تيليجرام",
      value: "@a3b6iii",
      href: "https://t.me/a3b6iii",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8 mt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">تواصل معنا</h1>
        <p className="text-muted-foreground mb-12">
          نحن هنا للإجابة على أسئلتك والاستماع إلى اقتراحاتك
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <a
                key={index}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors group"
              >
                <Icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-card-foreground mb-2">
                  {info.label}
                </h3>
                <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {info.value}
                </p>
              </a>
            );
          })}
        </div>

        <div className="bg-card p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">
            أرسل لنا رسالة
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                الاسم
              </label>
              <input
                type="text"
                placeholder="اسمك الكامل"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                الرسالة
              </label>
              <textarea
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              إرسال الرسالة
            </Button>
          </form>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
