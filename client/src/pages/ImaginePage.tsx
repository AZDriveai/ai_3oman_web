import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Wand2, Trash2, Download, Loader, Edit3, X } from "lucide-react";

export default function ImaginePage() {
  const { user, isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingImage, setEditingImage] = useState<{ id: number; url: string; prompt: string } | null>(null);

  const listQuery = trpc.images.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const generateMutation = trpc.images.generate.useMutation({
    onSuccess: () => {
      toast.success(editingImage ? "تم تعديل الصورة بنجاح" : "تم توليد الصورة بنجاح");
      setPrompt("");
      setEditingImage(null);
      setIsGenerating(false);
      listQuery.refetch();
    },
    onError: (error) => {
      toast.error("فشل توليد الصورة");
      setIsGenerating(false);
      console.error(error);
    },
  });

  const deleteMutation = trpc.images.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الصورة بنجاح");
      listQuery.refetch();
    },
    onError: () => {
      toast.error("فشل حذف الصورة");
    },
  });

  const handleGenerateImage = async () => {
    if (!prompt) {
      toast.error("يرجى إدخال وصف الصورة");
      return;
    }

    setIsGenerating(true);
    generateMutation.mutate({
      prompt,
      editMode: !!editingImage,
      originalImageUrl: editingImage?.url,
    });
  };

  const handleDeleteImage = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEditImage = (image: { id: number; imageUrl: string; prompt: string }) => {
    setEditingImage({ id: image.id, url: image.imageUrl, prompt: image.prompt });
    setPrompt(`عدل هذه الصورة: ${image.prompt}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${prompt.slice(0, 30)}.png`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>توليد الصور</CardTitle>
            <CardDescription>يرجى تسجيل الدخول للوصول إلى توليد الصور</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">توليد الصور</h1>
          <p className="text-muted-foreground">أنشئ صوراً فريدة باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* Generator Form */}
        <Card className="mb-8 overflow-hidden border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {editingImage ? "تحرير الصورة" : "توليد صورة جديدة"}
                </CardTitle>
                <CardDescription>
                  {editingImage 
                    ? "أدخل التغييرات التي تريد إجراءها على الصورة المختارة" 
                    : "اكتب وصفاً تفصيلياً للصورة التي تريد توليدها"}
                </CardDescription>
              </div>
              {editingImage && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setEditingImage(null);
                    setPrompt("");
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  إلغاء التحرير
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {editingImage && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                <img 
                  src={editingImage.url} 
                  alt="Original" 
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">الصورة الأصلية</p>
                  <p className="text-sm text-foreground truncate">{editingImage.prompt}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="image-prompt" className="text-sm font-bold">
                {editingImage ? "ما هي التعديلات المطلوبة؟" : "وصف الصورة"}
              </Label>
              <Textarea
                id="image-prompt"
                placeholder={editingImage ? "مثال: غير لون السماء إلى الأحمر..." : "مثال: منظر طبيعي جميل مع جبال وسماء زرقاء..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isGenerating}
                className="resize-none focus:ring-primary/20 transition-all text-lg"
              />
            </div>
            
            <Button
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt}
              className="gap-3 w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  جاري {editingImage ? "التعديل" : "التوليد"}...
                </>
              ) : (
                <>
                  {editingImage ? <Edit3 className="w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                  {editingImage ? "تطبيق التعديلات" : "توليد الصورة"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Images Gallery */}
        {listQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-64 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : listQuery.data?.images && listQuery.data.images.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">الصور المولدة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listQuery.data.images.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {image.status === "completed" && image.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownloadImage(image.imageUrl, image.prompt)}
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditImage(image)}
                            title="تحرير"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={deleteMutation.isPending}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : image.status === "generating" ? (
                      <div className="w-full h-64 bg-muted flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-destructive/10 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-destructive font-medium">فشل التوليد</p>
                          {image.error && (
                            <p className="text-xs text-muted-foreground mt-1">{image.error}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm line-clamp-2">{image.prompt}</CardTitle>
                    <CardDescription className="text-xs">
                      {new Date(image.createdAt).toLocaleDateString("ar-SA")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>لا توجد صور مولدة</CardTitle>
              <CardDescription>ابدأ بتوليد صورة جديدة الآن</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
