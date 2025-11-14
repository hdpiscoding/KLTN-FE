import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FileText,
    PlusCircle,
    Heart,
    User,
    Lock,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    onClick
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
                isActive && !isDanger && "bg-[#008DDA]/10 text-[#008DDA] font-medium shadow-sm",
                isDanger && "text-red-600 hover:bg-red-600 hover:text-white",
                !isActive && !isDanger && "text-gray-700 hover:text-gray-900"
            )}
        >
            <span className={cn(
                "flex-shrink-0 transition-transform duration-200",
                isActive && !isDanger && "text-[#008DDA]",
                isDanger && "group-hover:text-white"
            )}>
                {icon}
            </span>
            <span className="text-left text-[15px]">{label}</span>
        </button>
    );
};

export const UserSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logging out...');
        // Clear user data, tokens, etc.
        // navigate('/dang-nhap');
    };

    const menuItems = [
        {
            icon: <FileText size={20} />,
            label: 'Tin đăng',
            path: '/tin-dang',
        },
        {
            icon: <PlusCircle size={20} />,
            label: 'Đăng tin',
            path: '/dang-tin',
        },
        {
            icon: <Heart size={20} />,
            label: 'Tin yêu thích',
            path: '/tin-yeu-thich',
        },
        {
            icon: <User size={20} />,
            label: 'Thông tin cá nhân',
            path: '/thong-tin-ca-nhan',
        },
        {
            icon: <Lock size={20} />,
            label: 'Đổi mật khẩu',
            path: '/doi-mat-khau',
        },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#008DDA] focus:ring-offset-2 rounded-lg p-2 cursor-pointer"
                >
                    <img
                        src="/src/assets/timnha-icon.png"
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
    );
};

