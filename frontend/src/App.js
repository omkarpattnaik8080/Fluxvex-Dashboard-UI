import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/app-shell/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ClientsPage from "@/pages/ClientsPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import ReportsPage from "@/pages/ReportsPage";
import TemplatesPage from "@/pages/TemplatesPage";
import TemplatePreviewPage from "@/pages/TemplatePreviewPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

/** Route table for the authenticated Fluxvex workspace. */
function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:clientId" element={<ClientDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="templates/:templateId" element={<TemplatePreviewPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ className: "rounded-xl text-[13px]" }} />
    </TooltipProvider>
  );
}

export default App;
