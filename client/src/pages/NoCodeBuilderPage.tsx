import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Copy, Trash2 } from "lucide-react";
import { Streamdown } from "streamdown";

export default function NoCodeBuilderPage() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: codeList, isLoading: isLoadingList, refetch } = trpc.code.list.useQuery();
  const generateMutation = trpc.code.generate.useMutation();
  const deleteMutation = trpc.code.delete.useMutation();

  const handleGenerate = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error("يرجى ملء العنوان والوصف");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        title,
        prompt,
        description,
      });

      if (result.success) {
        toast.success("تم توليد الكود بنجاح!");
        setTitle("");
        setPrompt("");
        setDescription("");
        refetch();
      } else {
        toast.error(result.error || "فشل توليد الكود");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("حدث خطأ أثناء توليد الكود");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteMutation.mutateAsync({ id });
      if (result.success) {
        toast.success("تم حذف الكود بنجاح");
        refetch();
      } else {
        toast.error(result.error || "فشل حذف الكود");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("حدث خطأ أثناء حذف الكود");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("تم نسخ الكود");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">بناء التطبيقات بلا كود</h1>
          <p className="text-muted-foreground">استخدم الذكاء الاصطناعي لتوليد كود React احترافي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>توليد كود جديد</CardTitle>
                <CardDescription>صف ما تريد بناءه</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">العنوان</label>
                  <Input
                    placeholder="مثال: نموذج تسجيل الدخول"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">الوصف</label>
                  <Textarea
                    placeholder="وصف اختياري للمشروع"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isGenerating}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">المتطلبات</label>
                  <Textarea
                    placeholder="اكتب متطلباتك بالتفصيل..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !title.trim() || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    "توليد الكود"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Code List Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>الكود المولد</CardTitle>
                <CardDescription>
                  {isLoadingList ? "جاري التحميل..." : `${codeList?.codes?.length || 0} كود`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingList ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : codeList?.codes && codeList.codes.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {codeList.codes.map((code: any) => (
                      <div
                        key={code.id}
                        className="border border-border rounded-lg p-4 bg-card hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{code.title}</h3>
                            {code.description && (
                              <p className="text-sm text-muted-foreground mt-1">{code.description}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              code.status === "completed"
                                ? "bg-green-500/20 text-green-600"
                                : code.status === "generating"
                                  ? "bg-blue-500/20 text-blue-600"
                                  : "bg-red-500/20 text-red-600"
                            }`}
                          >
                            {code.status === "completed"
                              ? "مكتمل"
                              : code.status === "generating"
                                ? "جاري التوليد"
                                : "فشل"}
                          </span>
                        </div>

                        {code.code && (
                          <div className="bg-background rounded p-3 mb-3 max-h-40 overflow-y-auto">
                            <pre className="text-xs text-foreground overflow-x-auto">
                              <code>{code.code.substring(0, 300)}...</code>
                            </pre>
                          </div>
                        )}

                        {code.error && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-3">
                            <p className="text-xs text-red-600">{code.error}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {code.code && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyCode(code.code)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              نسخ
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(code.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>لا توجد أكواد مولدة حتى الآن</p>
                    <p className="text-sm mt-2">ابدأ بتوليد كود جديد من الجانب الأيسر</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
