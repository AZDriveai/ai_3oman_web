import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bell, Lock, Palette, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    soundEnabled: true,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("تم حفظ البيانات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("تم حفظ التفضيلات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ التفضيلات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground">
            أدر حسابك وتفضيلاتك
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              بيانات الملف الشخصي
            </CardTitle>
            <CardDescription>
              حدّث معلومات حسابك الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "جاري الحفظ..." : "حفظ البيانات"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </CardTitle>
            <CardDescription>
              تحكم في الإشعارات والتنبيهات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-muted-foreground">
                  استقبل تنبيهات عبر البريد الإلكتروني
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>إشعارات الدفع</Label>
                <p className="text-sm text-muted-foreground">
                  استقبل إشعارات الدفع في المتصفح
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, pushNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>الأصوات</Label>
                <p className="text-sm text-muted-foreground">
                  تشغيل الأصوات للإشعارات
                </p>
              </div>
              <Switch
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, soundEnabled: checked })
                }
              />
            </div>
            <Button
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التفضيلات"}
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              المظهر
            </CardTitle>
            <CardDescription>
              تخصيص مظهر التطبيق
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>الوضع الليلي</Label>
                <p className="text-sm text-muted-foreground">
                  استخدام الوضع الليلي بشكل افتراضي
                </p>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, darkMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              الأمان
            </CardTitle>
            <CardDescription>
              إدارة أمان حسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              تغيير كلمة المرور
            </Button>
            <Button variant="outline" className="w-full">
              إدارة جلسات تسجيل الدخول
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              منطقة الخطر
            </CardTitle>
            <CardDescription>
              إجراءات حساسة وغير قابلة للعكس
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10"
            >
              حذف الحساب
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
