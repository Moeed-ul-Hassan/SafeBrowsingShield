import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Protection from "@/pages/Protection";
import Accountability from "@/pages/Accountability";
import Statistics from "@/pages/Statistics";
import Motivation from "@/pages/Motivation";
import Sidebar from "@/components/Sidebar";
import BlockedOverlay from "@/components/BlockedOverlay";
import VpnDetectedOverlay from "@/components/VpnDetectedOverlay";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import Watermark from "@/components/Watermark";

function Router() {
  const [location] = useLocation();
  const [showBlockedOverlay, setShowBlockedOverlay] = useState(false);
  const [showVpnOverlay, setShowVpnOverlay] = useState(false);

  // Simulate blocked site detection for demo purposes
  useEffect(() => {
    // In a real implementation, this would be triggered by content detection
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'b') {
        setShowBlockedOverlay(prev => !prev);
      } else if (e.key === 'v') {
        setShowVpnOverlay(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar activePath={location} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/protection" component={Protection} />
          <Route path="/accountability" component={Accountability} />
          <Route path="/statistics" component={Statistics} />
          <Route path="/motivation" component={Motivation} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Overlays */}
      {showBlockedOverlay && <BlockedOverlay onClose={() => setShowBlockedOverlay(false)} />}
      {showVpnOverlay && <VpnDetectedOverlay onClose={() => setShowVpnOverlay(false)} />}
      
      {/* Buy Me A Coffee button */}
      <BuyMeCoffee username="moeedulhassan" />
      
      {/* Watermark */}
      <Watermark />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
