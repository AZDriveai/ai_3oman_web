import { useState, useCallback, useEffect } from "react";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";

export default function ChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "أنت مساعد ذكي متخصص في الإجابة على الأسئلة بالعربية.",
    },
  ]);

  const utils = trpc.useUtils();

  // Load messages when conversation changes
  const { data: messagesData, isLoading: isLoadingMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: currentConversationId! },
    { enabled: !!currentConversationId }
  );

  useEffect(() => {
    if (messagesData?.messages) {
      const formattedMessages: Message[] = messagesData.messages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      }));
      setMessages([
        { role: "system", content: "أنت مساعد ذكي متخصص في الإجابة على الأسئلة بالعربية." },
        ...formattedMessages
      ]);
    }
  }, [messagesData]);

  const chatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (response) => {
      if (response.success) {
        if (!currentConversationId && response.conversationId) {
          setCurrentConversationId(response.conversationId);
          utils.chat.getHistory.invalidate();
        }
        
        const assistantMessage: Message = {
          role: "assistant" as const,
          content: typeof response.message === "string" ? response.message : JSON.stringify(response.message),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMsg = typeof response.message === "string" ? response.message : "حدث خطأ في معالجة الرسالة";
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    },
  });

  const handleSendMessage = useCallback(
    (content: string) => {
      const userMessage: Message = {
        role: "user" as const,
        content,
      };

      setMessages((prev) => [...prev, userMessage]);

      chatMutation.mutate({
        conversationId: currentConversationId || undefined,
        messages: [...messages, userMessage],
      });
    },
    [messages, chatMutation, currentConversationId]
  );

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        role: "system",
        content: "أنت مساعد ذكي متخصص في الإجابة على الأسئلة بالعربية.",
      },
    ]);
  };

  const handleSelectChat = (id: string) => {
    setCurrentConversationId(parseInt(id));
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <Sidebar onNewChat={handleNewChat} onSelectChat={handleSelectChat} />
      
      <main className="flex-1 flex flex-col h-full lg:ml-0 transition-all duration-300">
        <div className="flex-1 flex flex-col h-full pt-16 lg:pl-0">
          <AIChatBox
            messages={messages.filter((m) => m.role !== "system")}
            onSendMessage={handleSendMessage}
            isLoading={chatMutation.isPending || isLoadingMessages}
            placeholder="اكتب سؤالك هنا..."
            emptyStateMessage="ابدأ محادثة جديدة مع ai_3oman"
            suggestedPrompts={[
              "ما هي أحدث تقنيات الذكاء الاصطناعي؟",
              "كيف يمكنني تحسين مهاراتي في البرمجة؟",
              "اكتب لي خطة عمل لمشروع صغير",
              "ساعدني في كتابة بريد إلكتروني رسمي"
            ]}
            height="100%"
            className="border-none rounded-none shadow-none"
          />
        </div>
      </main>
    </div>
  );
}
