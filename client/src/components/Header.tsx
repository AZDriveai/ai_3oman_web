import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  MessageSquare, 
  Mail, 
  Settings, 
  LogOut, 
  User as UserIcon,
  LayoutDashboard,
  Image as ImageIcon,
  CheckSquare,
  Search
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-full mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                ai_3oman
              </span>
            </a>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/chat">
              <a className={`px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2 ${location === '/chat' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <MessageSquare className="w-4 h-4" />
                المحادثة
              </a>
            </Link>
            <Link href="/tasks">
              <a className={`px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2 ${location === '/tasks' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <CheckSquare className="w-4 h-4" />
                المهام
              </a>
            </Link>
            <Link href="/imagine">
              <a className={`px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2 ${location === '/imagine' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <ImageIcon className="w-4 h-4" />
                الصور
              </a>
            </Link>
            <Link href="/search">
              <a className={`px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2 ${location === '/search' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <Search className="w-4 h-4" />
                البحث
              </a>
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden sm:block">
            <a>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                تواصل معنا
              </Button>
            </a>
          </Link>

          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border hover:border-primary/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.email ? `https://avatar.vercel.sh/${user.email}` : undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.[0] || user?.email?.[0] || <UserIcon className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 py-1">
                  <p className="text-sm font-bold leading-none">{user?.name || "مستخدم"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email || "لا يوجد بريد إلكتروني"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
