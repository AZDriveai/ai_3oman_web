import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Settings, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
}

export default function Sidebar({ onNewChat, onSelectChat }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [chats] = useState([
    { id: "1", title: "كيفية تعلم البرمجة؟" },
    { id: "2", title: "شرح الذكاء الاصطناعي" },
    { id: "3", title: "نصائح الإنتاجية" },
  ]);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 hover:bg-secondary rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-border transition-transform duration-300 lg:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={() => {
                onNewChat?.();
                setIsOpen(false);
              }}
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus size={18} />
              <span>دردشة جديدة</span>
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">
                السجل
              </h3>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat?.(chat.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm text-sidebar-foreground truncate"
                >
                  <MessageSquare className="inline-block mr-2" size={16} />
                  {chat.title}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <HelpCircle size={18} />
              <span>مساعدة</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Settings size={18} />
              <span>الإعدادات</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
