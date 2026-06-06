import { useState, useCallback } from "react";
import { AIChatBox } from "@/components/AIChatBox";
import type { Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "أنت مساعد ذكي متخصص في الإجابة على الأسئلة بالعربية.",
    },
    {
      role: "assistant",
      content: "مرحباً! أنا ai_3oman، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
    },
  ]);

  const chatMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (response) => {
      if (response.success) {
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
      // Add user message to the chat
      const userMessage: Message = {
        role: "user" as const,
        content,
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send to the AI
      chatMutation.mutate({
        messages: [...messages, userMessage],
      });
    },
    [messages, chatMutation]
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <AIChatBox
        messages={messages.filter((m) => m.role !== "system")}
        onSendMessage={handleSendMessage}
        isLoading={chatMutation.isPending}
        placeholder="اكتب سؤالك هنا..."
        emptyStateMessage="ابدأ محادثة جديدة"
        suggestedPrompts={[
          "ما هو الذكاء الاصطناعي؟",
          "كيفية تعلم البرمجة؟",
          "شرح التعلم الآلي",
        ]}
        height="100%"
      />
    </div>
  );
}
