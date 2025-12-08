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
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const linkClass = (itemPath) =>
    `flex items-center px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${
      pathname.startsWith(itemPath)
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100"
    } ${collapsed ? 'justify-center px-3' : ''}`;

  const iconClass = (itemPath) =>
    pathname.startsWith(itemPath) 
      ? 'text-white' 
      : 'text-gray-500 group-hover:text-blue-600';

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed  z-40
        bg-gradient-to-b from-white to-gray-50 
        h-min-screen 
        h-full
        shadow-xl shadow-blue-100/50 
        border-r border-gray-200
        transition-all duration-200
        ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        ${isMobile && !collapsed ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center justify-between ${collapsed ? 'justify-center' : ''}`}>
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Quran Admin
                </h2>
              </div>
            )}
            {collapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClass(item.path)}
              title={collapsed ? item.label : ""}
            >
              <item.icon className={`w-5 h-5 ${iconClass(item.path)} ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <button
            onClick={logout}
            className={`
              flex items-center w-full px-4 py-3 rounded-xl 
              text-red-600 
              hover:bg-red-50 hover:border-red-200
              border border-transparent
              transition-all duration-200
              cursor-pointer
              ${collapsed ? 'justify-center px-3' : ''}
            `}
            title={collapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && (
              <span className="ml-3 font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}