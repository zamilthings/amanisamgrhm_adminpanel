// App.jsx - Clear separation
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { 
  Home, 
  Login, 
  Dashboard,
  Surahs,
  Verses,
  Thafseer,
  Feedbacks,
  Settings,
  About,
  PrivacyPolicy,
  TermsOfService,
  Contact,
 } from "@/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/surahs" element={<Surahs />} />
          <Route path="/admin/verses" element={<Verses />} />
          <Route path="/admin/thafseer" element={<Thafseer />} />
          <Route path="/admin/feedbacks" element={<Feedbacks />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/about" element={<About />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}