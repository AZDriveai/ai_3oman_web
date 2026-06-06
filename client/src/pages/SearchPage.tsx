import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, Image as ImageIcon, CheckSquare, Code2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch search results
  const { data: chatHistory } = trpc.chat.getHistory.useQuery();
  const { data: tasksList } = trpc.tasks.list.useQuery();
  const { data: imagesList } = trpc.images.list.useQuery();

  // Filter results based on search query
  const filterResults = (items: any[], searchFields: string[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      searchFields.some((field) =>
        String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const chatResults = filterResults(chatHistory?.conversations || [], ["title", "description"]);
  const taskResults = filterResults(tasksList?.tasks || [], ["title", "description"]);
  const imageResults = filterResults(imagesList?.images || [], ["prompt"]);

  const allResults = [
    ...chatResults.map((item) => ({ type: "chat", ...item })),
    ...taskResults.map((item) => ({ type: "task", ...item })),
    ...imageResults.map((item) => ({ type: "image", ...item })),
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">البحث</h1>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن محادثات أو صور أو مهام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10"
              />
            </div>
            <Button>بحث</Button>
          </div>
        </div>

        {/* Results */}
        {searchQuery.trim() ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                الكل ({allResults.length})
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                محادثات ({chatResults.length})
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="w-4 h-4 mr-2" />
                مهام ({taskResults.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                صور ({imageResults.length})
              </TabsTrigger>
            </TabsList>

            {/* All Results */}
            <TabsContent value="all" className="space-y-4">
              {allResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    لم يتم العثور على نتائج
                  </CardContent>
                </Card>
              ) : (
                allResults.map((result, index) => (
                  <SearchResultCard key={index} result={result} />
                ))
              )}
            </TabsContent>

            {/* Chat Results */}
            <TabsContent value="chat" className="space-y-4">
              {chatResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    لم يتم العثور على محادثات
                  </CardContent>
                </Card>
              ) : (
                chatResults.map((result, index) => (
                  <ChatResultCard key={index} chat={result} />
                ))
              )}
            </TabsContent>

            {/* Task Results */}
            <TabsContent value="tasks" className="space-y-4">
              {taskResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    لم يتم العثور على مهام
                  </CardContent>
                </Card>
              ) : (
                taskResults.map((result, index) => (
                  <TaskResultCard key={index} task={result} />
                ))
              )}
            </TabsContent>

            {/* Image Results */}
            <TabsContent value="images" className="space-y-4">
              {imageResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    لم يتم العثور على صور
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imageResults.map((result, index) => (
                    <ImageResultCard key={index} image={result} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                ابدأ الكتابة للبحث عن محادثاتك وصورك ومهامك
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// Search Result Card Component
function SearchResultCard({ result }: { result: any }) {
  const getIcon = () => {
    switch (result.type) {
      case "chat":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "task":
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="pt-6 flex items-start gap-4">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{result.title || result.prompt}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {result.description || result.content?.substring(0, 100)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(result.createdAt).toLocaleDateString("ar-SA")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Chat Result Card
function ChatResultCard({ chat }: { chat: any }) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="pt-6 flex items-start gap-4">
        <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{chat.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{chat.description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(chat.createdAt).toLocaleDateString("ar-SA")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Task Result Card
function TaskResultCard({ task }: { task: any }) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="pt-6 flex items-start gap-4">
        <CheckSquare className="w-5 h-5 text-green-500 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{task.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {task.status}
            </span>
            <p className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString("ar-SA")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Image Result Card
function ImageResultCard({ image }: { image: any }) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
      <div className="aspect-square bg-muted flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <CardContent className="pt-4">
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {image.prompt}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(image.createdAt).toLocaleDateString("ar-SA")}
        </p>
      </CardContent>
    </Card>
  );
}
