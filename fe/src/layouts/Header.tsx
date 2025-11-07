import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/timnha-landscape.png";
import avatarImg from "@/assets/timnha-icon.png";
import {
    Menu,
    Home,
    Key,
    TrendingUp,
    Calculator,
    PenSquare,
    FileText,
    UserCircle,
    Lock,
    LogOut
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
    const navigate = useNavigate();
    const isLoggin = true; // Placeholder for future authentication logic

    const baseNavItems = [
        { label: "Mua nhà", path: "/mua-nha", icon: <Home className="w-4 h-4" /> },
        { label: "Thuê nhà", path: "/thue-nha", icon: <Key className="w-4 h-4" /> },
        { label: "Giá nhà đất", path: "/gia-nha-dat", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Định giá nhà", path: "/dinh-gia-nha", icon: <Calculator className="w-4 h-4" /> },
    ];

    // Add "Đăng tin" when logged in
    const navItems = isLoggin
        ? [...baseNavItems, { label: "Đăng tin", path: "/dang-tin", icon: <PenSquare className="w-4 h-4" /> }]
        : baseNavItems;

    const handleLogout = () => {
        
        // Add your logout logic here
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 w-screen bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 cursor-pointer">
                        <img src={logo} alt="TimNha" className="h-8 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-gray-700 hover:text-[#008DDA] transition-colors font-semibold flex items-center gap-2"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Auth Section */}
                        <div className="pl-6">
                            {!isLoggin ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-[#008DDA] transition-colors font-semibold flex items-center gap-2"
                                    >
                                        <UserCircle className="w-4 h-4" />
                                        Đăng nhập
                                    </Link>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <Link
                                        to="/register"
                                        className="text-gray-700 hover:text-[#008DDA] transition-colors font-semibold flex items-center gap-2"
                                    >
                                        <PenSquare className="w-4 h-4" />
                                        Đăng ký
                                    </Link>
                                </>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="cursor-pointer">
                                        <button className="p-1 rounded-full overflow-hidden border-2 border-transparent hover:border-[#008DDA] transition-colors">
                                            <img
                                                src={avatarImg}
                                                alt="User avatar"
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/quan-ly-tin-dang" className="w-full flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Quản lý tin đăng
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/thong-tin-ca-nhan" className="w-full flex items-center gap-2">
                                                <UserCircle className="w-4 h-4" />
                                                Thông tin cá nhân
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/doi-mat-khau" className="w-full flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Đổi mật khẩu
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            variant="destructive"
                                            className="cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 cursor-pointer">
                                    <Menu className="h-6 w-6 text-gray-700" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {navItems.map((item) => (
                                    <DropdownMenuItem key={item.path} asChild>
                                        <Link to={item.path} className="w-full cursor-pointer flex items-center gap-2">
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}

                                {isLoggin ? (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/quan-ly-tin-dang" className="w-full flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Quản lý tin đăng
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/thong-tin-ca-nhan" className="w-full flex items-center gap-2">
                                                <UserCircle className="w-4 h-4" />
                                                Thông tin cá nhân
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link to="/doi-mat-khau" className="w-full flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Đổi mật khẩu
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            variant="destructive"
                                            className="cursor-pointer flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/login" className="w-full flex items-center gap-2">
                                                <UserCircle className="w-4 h-4" />
                                                Đăng nhập
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/register" className="w-full flex items-center gap-2">
                                                <PenSquare className="w-4 h-4" />
                                                Đăng ký
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};
