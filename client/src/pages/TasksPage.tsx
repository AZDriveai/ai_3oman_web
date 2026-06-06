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

export default function TasksPage() {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [schedule, setSchedule] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const listQuery = trpc.tasks.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">المهام</h1>
            <p className="text-muted-foreground">إنشاء وإدارة المهام المجدولة</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                إنشاء مهمة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء مهمة جديدة</DialogTitle>
                <DialogDescription>أنشئ مهمة جديدة وحددها للتنفيذ</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                  className="w-full"
                >
                  {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء المهمة"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
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
          <div className="space-y-4">
            {listQuery.data.tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {statusIcons[task.status]}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        {task.description && (
                          <CardDescription className="mt-1">{task.description}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">الحالة</span>
                      <p className="text-sm font-medium capitalize">
                        {statusLabels[task.status]}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">الجدولة</span>
                      <p className="text-sm font-medium">{task.schedule || "بدون جدولة"}</p>
                    </div>
                    {task.lastRun && (
                      <div>
                        <span className="text-xs text-muted-foreground">آخر تنفيذ</span>
                        <p className="text-sm font-medium">
                          {new Date(task.lastRun).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    )}
                    {task.nextRun && (
                      <div>
                        <span className="text-xs text-muted-foreground">التنفيذ التالي</span>
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
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>لا توجد مهام</CardTitle>
              <CardDescription>ابدأ بإنشاء مهمة جديدة</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء مهمة الآن
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء مهمة جديدة</DialogTitle>
                    <DialogDescription>أنشئ مهمة جديدة وحددها للتنفيذ</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
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
                      className="w-full"
                    >
                      {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء المهمة"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
