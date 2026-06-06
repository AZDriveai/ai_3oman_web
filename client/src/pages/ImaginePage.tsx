import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Wand2, Trash2, Download, Loader } from "lucide-react";

export default function ImaginePage() {
  const { user, isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const listQuery = trpc.images.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const generateMutation = trpc.images.generate.useMutation({
    onSuccess: () => {
      toast.success("تم توليد الصورة بنجاح");
      setPrompt("");
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
    });
  };

  const handleDeleteImage = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      deleteMutation.mutate({ id });
    }
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>وصف الصورة</CardTitle>
            <CardDescription>اكتب وصفاً تفصيلياً للصورة التي تريد توليدها</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-prompt">النص الوصفي</Label>
              <Textarea
                id="image-prompt"
                placeholder="مثال: منظر طبيعي جميل مع جبال وسماء زرقاء..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isGenerating}
              />
            </div>
            <Button
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt}
              className="gap-2 w-full"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  توليد الصورة
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
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={deleteMutation.isPending}
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
