import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

/**
 * Design Philosophy: Modern Minimalist
 * - Clean white background with subtle accents
 * - Blue primary color for interactions
 * - IBM Plex Sans for body text, Geist for headings
 * - Two-column layout with sidebar and main content
 * - Smooth transitions and minimal animations
 */

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex flex-1 mt-16">
        <Sidebar
          onNewChat={() => setCurrentChatId(null)}
          onSelectChat={(id) => setCurrentChatId(id)}
        />

        <main className="flex-1 lg:ml-64 flex flex-col">
          <ChatInterface />
        </main>
      </div>
      <Footer />
    </div>
  );
}
