
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BotManagement from "./pages/BotManagement";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import PromptManagement from "./pages/PromptManagement";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import AuthPages from "./pages/auth/AuthPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/bots" element={<BotManagement />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/:folderId" element={<CampaignDetail />} />
                <Route path="/prompts" element={<PromptManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/auth/*" element={<AuthPages />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
