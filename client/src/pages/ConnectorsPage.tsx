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
import { Github, Mail, Zap, Slack, BookOpen, Plus, Trash2, CheckCircle2, AlertCircle, Circle, ExternalLink, Search, Filter } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

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

const statusColors: Record<string, string> = {
  connected: "bg-green-500/10 text-green-500 border-green-500/20",
  disconnected: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function ConnectorsPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("");
  const [connectorName, setConnectorName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

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

  // Filter and Search Logic
  const filteredConnectors = listQuery.data?.connectors?.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || c.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">الموصلات</h1>
            <p className="text-muted-foreground text-lg">
              قم بربط وتوسيع قدرات منصتك من خلال دمج الخدمات الخارجية
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" />
                إضافة موصل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">إضافة موصل جديد</DialogTitle>
                <DialogDescription>
                  اختر الخدمة التي تريد ربطها وامنحها اسماً مميزاً
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="connector-type">نوع الخدمة</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="connector-type" className="h-12">
                      <SelectValue placeholder="اختر الخدمة" />
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
                    placeholder="مثال: حساب العمل على GitHub"
                    value={connectorName}
                    onChange={(e) => setConnectorName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={handleCreateConnector}
                  disabled={createMutation.isPending}
                  className="w-full h-12 text-lg"
                >
                  {createMutation.isPending ? "جاري الإنشاء..." : "تأكيد الربط"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في الموصلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-10 bg-background"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px] h-10 bg-background">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="تصفية حسب" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="google_drive">Google Drive</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="notion">Notion</SelectItem>
                <SelectItem value="zapier">Zapier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Section */}
        {listQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-[200px] bg-muted/20" />
            ))}
          </div>
        ) : filteredConnectors && filteredConnectors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnectors.map((connector) => (
              <Card key={connector.id} className="group hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                        {connectorIcons[connector.type] || <Plus className="w-6 h-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{connector.name}</CardTitle>
                        <CardDescription className="font-medium text-primary/80">
                          {connectorNames[connector.type]}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${statusColors[connector.status]} border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                      {connector.status === "connected" ? "متصل" : connector.status === "error" ? "خطأ" : "غير متصل"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${connector.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      تاريخ الربط: {new Date().toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="default" size="sm" className="flex-1 gap-2 h-10 font-semibold">
                      {connector.status === "connected" ? "إدارة الاتصال" : "بدء الاتصال"}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => handleDeleteConnector(connector.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border-2 border-dashed border-border/50">
            <div className="p-6 bg-muted rounded-full mb-6">
              <Zap className="w-12 h-12 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">لا توجد موصلات نشطة</h3>
            <p className="text-muted-foreground mb-8 text-center max-w-sm">
              ابدأ بربط أدواتك المفضلة لتتمكن من أتمتة مهامك والوصول إلى بياناتك بسهولة
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              إضافة أول موصل لك
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
