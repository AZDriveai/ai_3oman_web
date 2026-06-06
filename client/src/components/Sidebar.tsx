import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Settings, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
}

import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Sidebar({ onNewChat, onSelectChat }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const { data: historyData, isLoading } = trpc.chat.getHistory.useQuery();
  const chats = historyData?.conversations || [];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-background border border-border shadow-sm rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-border transition-all duration-300 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background border border-border rounded-full items-center justify-center shadow-sm z-50 hover:bg-secondary transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={() => {
                onNewChat?.();
                setIsOpen(false);
              }}
              className={cn(
                "w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all",
                isCollapsed ? "px-0 justify-center" : ""
              )}
              title="دردشة جديدة"
            >
              <Plus size={18} />
              {!isCollapsed && <span>دردشة جديدة</span>}
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">
                  السجل
                </h3>
              )}
              {isLoading ? (
                <div className="space-y-2 px-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-sidebar-accent/50 animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat?.(chat.id.toString());
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm text-sidebar-foreground group",
                      isCollapsed ? "justify-center" : "text-right"
                    )}
                    title={chat.title}
                  >
                    <MessageSquare className="shrink-0" size={16} />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{chat.title}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-2 text-sidebar-foreground hover:bg-sidebar-accent transition-all",
                isCollapsed ? "px-0 justify-center" : "justify-start"
              )}
              title="مساعدة"
            >
              <HelpCircle size={18} className="shrink-0" />
              {!isCollapsed && <span>مساعدة</span>}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-2 text-sidebar-foreground hover:bg-sidebar-accent transition-all",
                isCollapsed ? "px-0 justify-center" : "justify-start"
              )}
              title="الإعدادات"
            >
              <Settings size={18} className="shrink-0" />
              {!isCollapsed && <span>الإعدادات</span>}
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
