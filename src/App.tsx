import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Tickets from "@/pages/Tickets";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminPilots from "@/pages/admin/AdminPilots";
import AdminMessages from "@/pages/admin/AdminMessages";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  return (
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
          path="/dashboard/pilots"
          element={
            <ProtectedRoute>
              <AdminPilots />
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
  );
}

export default App;