import "./global.css";
import React from "react";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Clients from "./pages/Clients";
import LRSU from "./pages/LRSU";
import Reports from "./pages/Reports";
import AIAdvisor from "./pages/AIAdvisor";
import Support from "./pages/Support";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/lrsu" element={<LRSU />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/support" element={<Support />} />
            <Route path="/sales" element={<Sales />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
