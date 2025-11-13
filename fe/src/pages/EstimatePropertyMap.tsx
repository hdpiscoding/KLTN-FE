import React from 'react';
import { Button } from "@/components/ui/button.tsx";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EstimatePropertyMap: React.FC = () => {
    const navigate = useNavigate();

    const handleConfirmLocation = () => {
        console.log('Location confirmed');
        navigate("/dinh-gia-nha/ket-qua");
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-4xl">
                <div className="flex flex-col gap-8">
                    {/* Title */}
                    <div className="w-full text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold">ĐỊNH GIÁ NHÀ</h2>
                    </div>

                    {/* Confirmation Question */}
                    <div className="text-center">
                        <p className="text-lg sm:text-xl text-gray-700">
                            Đây có phải vị trí của bạn?
                        </p>
                    </div>

                    {/* Map Placeholder */}
                    <div className="w-full aspect-[16/10] bg-gray-100 rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                        {/* Map placeholder content */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>

                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <MapPin className="w-16 h-16 text-[#008DDA]" />
                            <div className="text-center">
                                <p className="text-gray-600 font-medium text-lg">
                                    Vị trí của bạn sẽ hiển thị ở đây
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Google Maps sẽ được tích hợp vào đây
                                </p>
                            </div>
                        </div>

                        {/* Decorative grid pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="w-full h-full" style={{
                                backgroundImage: `
                                    linear-gradient(to right, #008DDA 1px, transparent 1px),
                                    linear-gradient(to bottom, #008DDA 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px'
                            }}></div>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <Button
                        onClick={handleConfirmLocation}
                        className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base sm:text-lg"
                    >
                        Đúng, đây là vị trí của tôi
                    </Button>
                </div>
            </div>
        </div>
    );
};

