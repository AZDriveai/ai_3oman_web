import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Image as ImageIcon, CheckSquare, Zap, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch statistics
  const { data: chatHistory } = trpc.chat.getHistory.useQuery();
  const { data: tasksList } = trpc.tasks.list.useQuery();
  const { data: imagesList } = trpc.images.list.useQuery();

  const conversationsCount = chatHistory?.conversations?.length || 0;
  const tasksCount = tasksList?.tasks?.length || 0;
  const imagesCount = imagesList?.images?.length || 0;

  const stats = [
    {
      title: "المحادثات",
      value: conversationsCount,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/chat",
    },
    {
      title: "الصور المُولّدة",
      value: imagesCount,
      icon: ImageIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/imagine",
    },
    {
      title: "المهام",
      value: tasksCount,
      icon: CheckSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/tasks",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            مرحباً بك، {user?.name || "مستخدم"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            إليك ملخص نشاطك اليومي وإحصائياتك
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <a>
                  <Card className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{stat.title}</CardTitle>
                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        انقر للعرض والتفاصيل
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/chat">
              <a>
                <Button variant="outline" className="w-full h-12 gap-2 justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  محادثة جديدة
                </Button>
              </a>
            </Link>
            <Link href="/imagine">
              <a>
                <Button variant="outline" className="w-full h-12 gap-2 justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <ImageIcon className="w-5 h-5" />
                  توليد صورة
                </Button>
              </a>
            </Link>
            <Link href="/tasks">
              <a>
                <Button variant="outline" className="w-full h-12 gap-2 justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <CheckSquare className="w-5 h-5" />
                  إنشاء مهمة
                </Button>
              </a>
            </Link>
            <Link href="/builder">
              <a>
                <Button variant="outline" className="w-full h-12 gap-2 justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Zap className="w-5 h-5" />
                  كود جديد
                </Button>
              </a>
            </Link>
          </div>
        </div>

        {/* Features Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">الميزات المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  محادثات ذكية
                </CardTitle>
                <CardDescription>
                  تفاعل مع نموذج لغوي متقدم للحصول على إجابات دقيقة وسريعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  استخدم المحادثات للبحث والكتابة وحل المشاكل المعقدة بسهولة.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  إدارة متقدمة
                </CardTitle>
                <CardDescription>
                  نظم مهامك وتابع إنجازاتك بكفاءة عالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  استخدم نظام المهام المتقدم لتنظيم عملك والبقاء منتجاً.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  توليد الصور
                </CardTitle>
                <CardDescription>
                  حول أفكارك إلى صور مذهلة باستخدام الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ولد صوراً احترافية من وصف بسيط أو عدّل الصور الموجودة.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  جدولة ذكية
                </CardTitle>
                <CardDescription>
                  جدول مهامك تلقائياً وتابع تقدمك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  استخدم الجدولة المتقدمة لأتمتة المهام المتكررة.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
