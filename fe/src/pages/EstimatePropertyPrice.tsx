import React from 'react';
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/generalFormat.ts";

export const EstimatePropertyPrice: React.FC = () => {
    const navigate = useNavigate();

    // TODO: Replace with actual data from previous steps
    const estimatedPrice = 3500000000; // Sample price: 3.5 billion VND
    const address = "208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh";

    const handleContinue = () => {
        navigate("/dinh-gia-nha/dia-chi");
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-2xl">
                <div className="flex flex-col gap-8">
                    {/* Title */}
                    <div className="w-full text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold">ĐỊNH GIÁ NHÀ</h2>
                    </div>

                    {/* Estimated Price */}
                    <div className="text-center py-6">
                        <p className="text-sm sm:text-base text-gray-500 mb-3">
                            Giá ước tính của bất động sản
                        </p>
                        <p className="text-4xl sm:text-5xl font-semibold text-[#008DDA]">
                            {formatPrice(estimatedPrice)}
                        </p>
                    </div>

                    {/* Address */}
                    <div className="text-center px-4">
                        <p className="text-sm sm:text-base text-gray-500">
                            {address}
                        </p>
                    </div>

                    {/* Continue Button */}
                    <Button
                        onClick={handleContinue}
                        className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6] text-base"
                    >
                        Tiếp tục định giá
                    </Button>
                </div>
            </div>
        </div>
    );
};

