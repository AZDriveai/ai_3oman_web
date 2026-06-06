import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageSquare, Mail, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">ai_3oman</span>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <a className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground">
              الرئيسية
            </a>
          </Link>
          <Link href="/contact">
            <a className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground">
              التواصل
            </a>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Link href="/contact">
            <a>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">تواصل معنا</span>
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
