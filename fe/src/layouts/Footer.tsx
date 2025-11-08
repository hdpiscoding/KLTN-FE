import {Link} from "react-router-dom";
import logo from "@/assets/timnha-portrait.png";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Logo Section - 30% width on desktop */}
                    <div className="md:w-[30%] flex flex-col items-center md:items-start space-y-4">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <img src={logo} alt="TimNha" className="h-32 w-auto" />
                            <p className="text-[#4DB8F0] font-medium text-lg text-center md:text-left">
                                Tìm đúng nhà, sống đúng cách
                            </p>

                            <div className="flex items-center gap-4 mt-4">
                                <a href="#" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                    <Youtube className="w-6 h-6" />
                                </a>
                            </div>
                        </div>


                    </div>

                    {/* Navigation Columns - 70% width on desktop */}
                    <div className="md:w-[70%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Hướng Dẫn Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Hướng Dẫn</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about-us" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Về chúng tôi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Câu hỏi thường gặp
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/feedback" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Góp ý báo lỗi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/news" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Tin tức BĐS
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/living-index" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Chỉ số sống
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Qui định Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Qui định</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/term-of-use" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Điều khoản sử dụng
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/rules" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Quy chế hoạt động
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/posting-rules" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Quy định đăng tin
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/payment-guide" className="text-gray-600 hover:text-[#008DDA] transition-colors">
                                        Hướng dẫn thanh toán
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Liên hệ Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Liên hệ</h3>
                            <div className="space-y-3 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <span>0123456789</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <span>abc@gmail.com</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    <span>12/34 Minh Phụng, P.3, Q.11, TP.HCM</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span>8:00 - 17:30 (Thứ 2 - Thứ 6)</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-center text-gray-600 text-sm">
                        © {new Date().getFullYear()} timnha - Nền tảng tìm kiếm và gợi ý bất động sản dựa trên Chỉ số sống. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
