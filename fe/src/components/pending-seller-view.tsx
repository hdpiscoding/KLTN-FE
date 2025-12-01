import { Clock, CheckCircle } from "lucide-react";

export const PendingSellerView = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="max-w-md w-full p-8 text-center space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-center">
                    <div className="rounded-full bg-blue-100 p-4 relative">
                        <Clock className="w-12 h-12 text-[#008DDA] animate-pulse" />
                        {/*<div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">*/}
                        {/*    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping absolute"></div>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Yêu cầu đang chờ phê duyệt
                    </h2>
                    <p className="text-gray-600">
                        Yêu cầu trở thành người bán của bạn đang được xem xét.
                        Quá trình này thường mất 24-48 giờ làm việc.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-[#008DDA] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 text-left">
                            Chúng tôi đã nhận được yêu cầu của bạn
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-[#008DDA] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 text-left">
                            Đội ngũ của chúng tôi đang xem xét hồ sơ
                        </p>
                    </div>
                </div>

                <div className="pt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                        Bạn sẽ nhận được thông báo qua email khi yêu cầu được phê duyệt.
                    </p>
                    <p className="text-xs text-gray-500">
                        Nếu có thắc mắc, vui lòng liên hệ: <span className="font-medium text-[#008DDA]">support@timnha.vn</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

