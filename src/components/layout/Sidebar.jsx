import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Info,
  BookOpen,
  FileText,
  Book,
  MessageSquare,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/libs/useAuth";

const menuItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/admin/about", label: "About App", icon: Info },
  { path: "/admin/surahs", label: "Chapters", icon: Book },
  { path: "/admin/verses", label: "Verses", icon: FileText },
  { path: "/admin/thafseer", label: "Tafsir", icon: BookOpen },
  { path: "/admin/feedbacks", label: "Feedbacks", icon: MessageSquare },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isMobile || collapsed) return;

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, collapsed]);

  // Close on route change (mobile)
  useEffect(() => {
    if (isMobile && !collapsed) {
      onToggle();
    }
  }, [pathname]);

  const linkClass = (itemPath) =>
    `flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${
      pathname.startsWith(itemPath)
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100"
    } ${collapsed ? "justify-center px-3" : ""}`;

  const iconClass = (itemPath) =>
    pathname.startsWith(itemPath)
      ? "text-white"
      : "text-gray-500 group-hover:text-blue-600";

  // Clean sidebar state logic
  const isOpen = !collapsed;

  const sidebarClasses = `
    fixed z-40 h-full
    bg-gradient-to-b from-white to-gray-50
    shadow-xl border-r border-gray-200
    transition-all duration-200
    ${isOpen ? "w-64" : "w-20"}
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
  `;

  return (
    <>
      {/* Overlay (mobile only) */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <aside ref={sidebarRef} className={sidebarClasses}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center justify-between ${collapsed ? "justify-center" : ""}`}>
            {!collapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Book className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-blue-700">
                  Quran Admin
                </h2>
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Book className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            )}

            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-blue-50"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
              title={collapsed ? item.label : ""}
            >
              <item.icon
                className={`w-3 md:w-5 h-3 md:h-5 ${iconClass(item.path)} ${
                  collapsed ? "" : "mr-3"
                }`}
              />
              {!collapsed && (
                <span className="font-medium text-sm md:text-md">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <button
            onClick={logout}
            className={`flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition ${
              collapsed ? "justify-center px-3" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}