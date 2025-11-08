import React from 'react';

export const FAQ: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Câu Hỏi Thường Gặp</h3>
            <p className="mb-8 text-gray-700 leading-relaxed text-center">
                Dưới đây là một số câu hỏi phổ biến mà người dùng thường hỏi về <span className="text-[#008DDA] font-semibold">timnha</span>. Nếu bạn có thắc mắc khác, hãy liên hệ với chúng tôi!
            </p>

            <div className="space-y-6">
                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Chỉ số Sống là gì?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Chỉ số sống là một chỉ số toàn diện do <span className="text-[#008DDA] font-semibold">timnha</span> phát triển, đánh giá chất lượng cuộc sống tại từng khu vực dựa trên các yếu tố như môi trường, giao thông, y tế, giáo dục, an ninh và cộng đồng. Nó giúp bạn so sánh và chọn bất động sản phù hợp với lối sống của mình.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Làm thế nào để sử dụng nền tảng?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Bạn chỉ cần đăng ký tài khoản miễn phí, nhập các tiêu chí tìm kiếm như vị trí, ngân sách và ưu tiên Chỉ số sống. Hệ thống sẽ gợi ý các bất động sản phù hợp. Bạn cũng có thể xem chi tiết Chỉ số sống cho từng khu vực.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Dữ liệu trên nền tảng có đáng tin cậy không?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Có, chúng tôi thu thập dữ liệu từ các nguồn uy tín như cơ quan nhà nước, đối tác bất động sản và dữ liệu mở. Chỉ số sống được cập nhật định kỳ để đảm bảo tính chính xác và minh bạch.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Sử dụng <span className="text-[#008DDA] font-semibold">timnha</span> có mất phí không?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Hiện tại <span className="text-[#008DDA] font-semibold">timnha</span> hoàn toàn miễn phí cho người dùng cá nhân. Nhưng trong tương lai chúng tôi sẽ có các gói premium với tính năng nâng cao như gợi ý cá nhân hóa sâu hơn hoặc báo cáo chi tiết, tăng độ ưu tiên của tin đăng.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Tôi có thể liên hệ với ai nếu cần hỗ trợ?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Bạn có thể gửi email đến support@timnha.com hoặc sử dụng form liên hệ trên website. Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi trong vòng 24 giờ.
                    </p>
                </div>

                <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">Nền tảng có hỗ trợ trên thiết bị di động không?</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Hiện tại timnha chưa có phiên bản mobile nhưng bạn có thể sử dụng <span className="text-[#008DDA] font-semibold">timnha</span> bản web đã được thiết kế responsive để giúp bạn tìm kiếm bất động sản mọi lúc mọi nơi.
                    </p>
                </div>
            </div>
        </div>
    );
};