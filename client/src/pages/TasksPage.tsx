import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle, Clock, Play, Pause } from "lucide-react";

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  running: <Play className="w-5 h-5 text-blue-500" />,
  completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  failed: <AlertCircle className="w-5 h-5 text-red-500" />,
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  running: "قيد التنفيذ",
  completed: "مكتملة",
  failed: "فشلت",
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TasksPage() {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [schedule, setSchedule] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const listQuery = trpc.tasks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mock data for friends monitoring
  const friends = [
    { id: 1, name: "أحمد محمد", status: "online", lastTask: "توليد صورة", avatar: "https://avatar.vercel.sh/ahmed" },
    { id: 2, name: "سارة علي", status: "offline", lastTask: "محادثة ذكية", avatar: "https://avatar.vercel.sh/sara" },
    { id: 3, name: "خالد حسن", status: "online", lastTask: "إرسال بريد", avatar: "https://avatar.vercel.sh/khaled" },
  ];

  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء المهمة بنجاح");
      setTitle("");
      setDescription("");
      setSchedule("");
      setIsDialogOpen(false);
      listQuery.refetch();
    },
    onError: (error) => {
      toast.error("فشل إنشاء المهمة");
      console.error(error);
    },
  });

  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المهمة بنجاح");
      listQuery.refetch();
    },
    onError: () => {
      toast.error("فشل حذف المهمة");
    },
  });

  const handleCreateTask = () => {
    if (!title) {
      toast.error("يرجى إدخال عنوان المهمة");
      return;
    }

    createMutation.mutate({
      title,
      description,
      schedule,
    });
  };

  const handleDeleteTask = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
      deleteMutation.mutate({ id });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>المهام</CardTitle>
            <CardDescription>يرجى تسجيل الدخول للوصول إلى المهام</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="tasks" className="w-full" dir="rtl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">المهام والمراقبة</h1>
              <p className="text-muted-foreground">إدارة مهامك ومراقبة نشاط الأصدقاء</p>
            </div>
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="tasks">مهامي</TabsTrigger>
              <TabsTrigger value="friends">الأصدقاء</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    إنشاء مهمة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إنشاء مهمة جديدة</DialogTitle>
                    <DialogDescription>أنشئ مهمة جديدة وحددها للتنفيذ التلقائي</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">عنوان المهمة</Label>
                      <Input
                        id="task-title"
                        placeholder="مثال: إرسال تقرير يومي"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">الوصف</Label>
                      <Textarea
                        id="task-description"
                        placeholder="وصف تفصيلي للمهمة..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-schedule">جدولة (Cron)</Label>
                      <Select value={schedule} onValueChange={setSchedule}>
                        <SelectTrigger id="task-schedule">
                          <SelectValue placeholder="اختر جدولة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">بدون جدولة</SelectItem>
                          <SelectItem value="0 9 * * *">يومياً في الساعة 9 صباحاً</SelectItem>
                          <SelectItem value="0 12 * * *">يومياً في الساعة 12 ظهراً</SelectItem>
                          <SelectItem value="0 0 * * 0">أسبوعياً يوم الأحد</SelectItem>
                          <SelectItem value="0 0 1 * *">شهرياً في اليوم الأول</SelectItem>
                          <SelectItem value="*/30 * * * *">كل 30 دقيقة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleCreateTask}
                      disabled={createMutation.isPending}
                      className="w-full h-12 text-lg font-bold"
                    >
                      {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء المهمة"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {listQuery.isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : listQuery.data?.tasks && listQuery.data.tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listQuery.data.tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-all border-primary/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {statusIcons[task.status]}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            {task.description && (
                              <CardDescription className="mt-1 line-clamp-1">{task.description}</CardDescription>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteMutation.isPending}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">الحالة</span>
                          <p className="text-sm font-medium">
                            {statusLabels[task.status]}
                          </p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">الجدولة</span>
                          <p className="text-sm font-medium truncate">{task.schedule || "يدوي"}</p>
                        </div>
                        {task.lastRun && (
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">آخر تنفيذ</span>
                            <p className="text-sm font-medium">
                              {new Date(task.lastRun).toLocaleDateString("ar-SA")}
                            </p>
                          </div>
                        )}
                        {task.nextRun && (
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">التنفيذ التالي</span>
                            <p className="text-sm font-medium">
                              {new Date(task.nextRun).toLocaleDateString("ar-SA")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-20 border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">لا توجد مهام حالياً</CardTitle>
                  <CardDescription>ابدأ بإنشاء مهمة جديدة لتنفيذها تلقائياً</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إنشاء أول مهمة
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="friends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مراقبة نشاط الأصدقاء</CardTitle>
                <CardDescription>تابع آخر الأنشطة والمهام التي يقوم بها أصدقاؤك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {friends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{friend.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary/40" />
                            آخر نشاط: {friend.lastTask}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-full text-xs">متابعة</Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
