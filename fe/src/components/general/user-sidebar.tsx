import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Plus,
  Heart,
  User,
  Lock,
  LogOut,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useUserStore } from "@/store/userStore.ts";
import { toast } from "react-toastify";
import { useEstimationStore } from "@/store/estimationStore.ts";
import logo from "../../assets/timnha-icon.png";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  path,
  isActive,
  isDanger = false,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center cursor-pointer gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-gray-100 active:scale-[0.98]",
        isActive &&
          !isDanger &&
          "bg-[#008DDA]/10 text-[#008DDA] font-medium shadow-sm",
        isDanger && "text-red-600 hover:bg-red-600 hover:text-white",
        !isActive && !isDanger && "text-gray-700 hover:text-gray-900"
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 transition-transform duration-200",
          isActive && !isDanger && "text-[#008DDA]",
          isDanger && "group-hover:text-white"
        )}
      >
        {icon}
      </span>
      <span className="text-left text-[15px]">{label}</span>
    </button>
  );
};

// Bottom Nav Item Component for mobile
const BottomNavItem: React.FC<SidebarItemProps & { isCentral?: boolean }> = ({
  icon,
  label,
  path,
  isActive,
  isCentral = false,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
        isCentral
          ? "relative -mt-6 w-16 h-16 rounded-full bg-[#008DDA] text-white shadow-lg hover:bg-[#0064A6] active:scale-95"
          : cn(
              "flex-1 py-2 px-1",
              isActive && "text-[#008DDA]",
              !isActive && "text-gray-600 hover:text-gray-900"
            )
      )}
    >
      <span
        className={cn(
          "transition-transform duration-200",
          isCentral ? "text-white" : ""
        )}
      >
        {icon}
      </span>
      <span
        className={cn("text-[10px] mt-1 font-medium", isCentral && "sr-only")}
      >
        {label}
      </span>
    </button>
  );
};

export const UserSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useUserStore((state) => state.logout);
  const clearUserInfo = useUserStore((state) => state.clearUserInfo);
  const { clearEstimationData } = useEstimationStore();

  const handleLogout = () => {
    logout();
    clearUserInfo();
    clearEstimationData();
    navigate("/");
    toast.success("Đăng xuất thành công!");
    console.log("Logging out...");
  };

  const menuItems = [
    {
      icon: <FileText size={20} />,
      label: "Tin đăng",
      path: "/tin-dang",
    },
    {
      icon: <Plus size={20} />,
      label: "Đăng tin",
      path: "/dang-tin",
    },
    {
      icon: <Heart size={20} />,
      label: "Tin yêu thích",
      path: "/tin-yeu-thich",
    },
    {
      icon: <History size={20} />,
      label: "Lịch sử định giá",
      path: "/dinh-gia-nha/lich-su",
    },
    {
      icon: <User size={20} />,
      label: "Thông tin cá nhân",
      path: "/thong-tin-ca-nhan",
    },
    {
      icon: <Lock size={20} />,
      label: "Đổi mật khẩu",
      path: "/doi-mat-khau",
    },
  ];

  const bottomNavItems = [
    menuItems[0], // Tin đăng
    menuItems[2], // Tin yêu thích
    menuItems[1], // Đăng tin (center)
    menuItems[3], // Lịch sử định giá
    menuItems[4], // Thông tin cá nhân
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#008DDA] focus:ring-offset-2 rounded-lg p-2 cursor-pointer"
          >
            <img
              src={logo}
              alt="TimNha Logo"
              className="h-16 w-auto drop-shadow-sm"
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <SidebarItem
            icon={<LogOut size={20} />}
            label="Đăng xuất"
            path=""
            isActive={false}
            isDanger={true}
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around px-2 pb-safe">
          {bottomNavItems.map((item, index) => (
            <BottomNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              isCentral={index === 2} // Đăng tin is at index 2
            />
          ))}
        </div>
      </nav>
    </>
  );
};
