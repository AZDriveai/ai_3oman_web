import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";

// Lazy loading pages for performance
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ConnectorsPage = lazy(() => import("./pages/ConnectorsPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const ImaginePage = lazy(() => import("./pages/ImaginePage"));
const NoCodeBuilderPage = lazy(() => import("./pages/NoCodeBuilderPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  return (
    <Suspense fallback={<DashboardLayoutSkeleton />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/terms"} component={Terms} />
        <Route path={"/privacy"} component={Privacy} />
        {!isAuthenticated ? (
          <>
            <Route path={"/login"} component={Login} />
            <Route path={"/*"} component={Login} />
          </>
        ) : (
          <>
            <Route path={"/dashboard"} component={DashboardPage} />
            <Route path={"/settings"} component={SettingsPage} />
            <Route path={"/search"} component={SearchPage} />
            <Route path={"/chat"} component={ChatPage} />
            <Route path={"/connectors"} component={ConnectorsPage} />
            <Route path={"/tasks"} component={TasksPage} />
            <Route path={"/imagine"} component={ImaginePage} />
            <Route path={"/builder"} component={NoCodeBuilderPage} />
            <Route path={"/404"} component={NotFound} />
            <Route component={NotFound} />
          </>
        )}
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <div lang="ar" dir="rtl">
        <ThemeProvider defaultTheme="dark" switchable>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
