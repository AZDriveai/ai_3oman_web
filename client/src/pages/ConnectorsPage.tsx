import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Github, Mail, Zap, Slack, BookOpen, Plus, Trash2, CheckCircle2, AlertCircle, Circle } from "lucide-react";

const connectorIcons: Record<string, React.ReactNode> = {
  github: <Github className="w-6 h-6" />,
  google_drive: <Mail className="w-6 h-6" />,
  slack: <Slack className="w-6 h-6" />,
  notion: <BookOpen className="w-6 h-6" />,
  zapier: <Zap className="w-6 h-6" />,
};

const connectorNames: Record<string, string> = {
  github: "GitHub",
  google_drive: "Google Drive",
  slack: "Slack",
  notion: "Notion",
  zapier: "Zapier",
};

const statusIcons: Record<string, React.ReactNode> = {
  connected: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  disconnected: <Circle className="w-5 h-5 text-gray-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
};

export default function ConnectorsPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("");
  const [connectorName, setConnectorName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const listQuery = trpc.connectors.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.connectors.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الموصل بنجاح");
      setSelectedType("");
      setConnectorName("");
      setIsDialogOpen(false);
      listQuery.refetch();
    },
    onError: (error) => {
      toast.error("فشل إنشاء الموصل");
      console.error(error);
    },
  });

  const deleteMutation = trpc.connectors.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الموصل بنجاح");
      listQuery.refetch();
    },
    onError: () => {
      toast.error("فشل حذف الموصل");
    },
  });

  const handleCreateConnector = () => {
    if (!selectedType || !connectorName) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    createMutation.mutate({
      type: selectedType as "github" | "google_drive" | "slack" | "notion" | "zapier",
      name: connectorName,
    });
  };

  const handleDeleteConnector = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الموصل؟")) {
      deleteMutation.mutate({ id });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>الموصلات</CardTitle>
            <CardDescription>يرجى تسجيل الدخول للوصول إلى الموصلات</CardDescription>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">الموصلات</h1>
            <p className="text-muted-foreground">ربط الأدوات الخارجية والخدمات مع منصتك</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة موصل جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة موصل جديد</DialogTitle>
                <DialogDescription>اختر نوع الموصل والخدمة التي تريد ربطها</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connector-type">نوع الموصل</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="connector-type">
                      <SelectValue placeholder="اختر نوع الموصل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="google_drive">Google Drive</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="notion">Notion</SelectItem>
                      <SelectItem value="zapier">Zapier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connector-name">اسم الموصل</Label>
                  <Input
                    id="connector-name"
                    placeholder="مثال: حسابي على GitHub"
                    value={connectorName}
                    onChange={(e) => setConnectorName(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateConnector}
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء الموصل"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Connectors Grid */}
        {listQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : listQuery.data?.connectors && listQuery.data.connectors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listQuery.data.connectors.map((connector) => (
              <Card key={connector.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {connectorIcons[connector.type] || <Plus className="w-6 h-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{connector.name}</CardTitle>
                        <CardDescription>{connectorNames[connector.type]}</CardDescription>
                      </div>
                    </div>
                    {statusIcons[connector.status]}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">الحالة:</span>
                      <span className="text-sm font-medium capitalize">
                        {connector.status === "connected" && "متصل"}
                        {connector.status === "disconnected" && "غير متصل"}
                        {connector.status === "error" && "خطأ"}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        {connector.status === "connected" ? "إعادة الاتصال" : "الاتصال"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConnector(connector.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>لا توجد موصلات</CardTitle>
              <CardDescription>ابدأ بإضافة موصل جديد لربط الخدمات الخارجية</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة موصل الآن
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة موصل جديد</DialogTitle>
                    <DialogDescription>اختر نوع الموصل والخدمة التي تريد ربطها</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="connector-type">نوع الموصل</Label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger id="connector-type">
                          <SelectValue placeholder="اختر نوع الموصل" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="google_drive">Google Drive</SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="notion">Notion</SelectItem>
                          <SelectItem value="zapier">Zapier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="connector-name">اسم الموصل</Label>
                      <Input
                        id="connector-name"
                        placeholder="مثال: حسابي على GitHub"
                        value={connectorName}
                        onChange={(e) => setConnectorName(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCreateConnector}
                      disabled={createMutation.isPending}
                      className="w-full"
                    >
                      {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء الموصل"}
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
