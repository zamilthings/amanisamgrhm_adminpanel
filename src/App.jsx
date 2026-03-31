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

        <Route  path="/admin" element={<AdminLayout />}>
         <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="surahs" element={<Surahs />} />
          <Route path="verses" element={<Verses />} />
          <Route path="thafseer" element={<Thafseer />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}