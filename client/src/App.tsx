import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import ConnectorsPage from "./pages/ConnectorsPage";
import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayoutSkeleton } from "./components/DashboardLayoutSkeleton";

function Router() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path={"/login"} component={Login} />
          <Route path={"/*"} component={Login} />
        </>
      ) : (
        <>
          <Route path={"/"} component={Home} />
          <Route path={"/chat"} component={ChatPage} />
          <Route path={"/connectors"} component={ConnectorsPage} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <div lang="ar" dir="rtl">
        <ThemeProvider
          defaultTheme="dark"
          switchable
        >
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
