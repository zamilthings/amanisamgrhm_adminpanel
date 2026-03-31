import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/libs/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();
 const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
  return localStorage.getItem("sidebar") === "collapsed";
});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
  setSidebarCollapsed(prev => {
    const next = !prev;
    localStorage.setItem("sidebar", next ? "collapsed" : "open");
    return next;
  });
};

if (!user && !loading && location.pathname.startsWith('/admin')) {
  return <Navigate to="/admin/login" replace />;
}

if (user && location.pathname.startsWith('/admin/login')) {
  return <Navigate to="/admin/dashboard" replace />;
}

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} />
        <main className="p-3 md:p-6 min-h-[calc(100vh-92px)]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}