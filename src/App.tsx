import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Tickets from "@/pages/Tickets";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminMessages from "@/pages/admin/AdminMessages";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/dashboard/login" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <AdminMessages />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Footer />
      </Router>
    </SessionContextProvider>
  );
}

export default App;