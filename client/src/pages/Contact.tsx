import { Button } from "@/components/ui/button";
import { Mail, Phone, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Design Philosophy: Modern Minimalist
 * - Contact page with clean layout
 * - Contact information prominently displayed
 * - Simple contact form with validation
 */

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسمك");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("يرجى إدخال بريدك الإلكتروني");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("يرجى إدخال رسالتك");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك قريباً.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="اسمك الكامل"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  الرسالة
                </label>
                <textarea
                  name="message"
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
