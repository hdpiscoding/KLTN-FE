import React from 'react';

const TermsOfUse: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Điều Khoản Sử Dụng</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chào mừng bạn đến với <span className="text-[#008DDA] font-semibold">timnha</span>! Bằng cách truy cập hoặc sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các Điều khoản Sử dụng sau đây. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ. Điều khoản này có hiệu lực từ ngày 08/11/2025 và có thể được cập nhật định kỳ.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">1. Giới Thiệu</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> là nền tảng tìm kiếm và gợi ý bất động sản dựa trên Chỉ số Sống, giúp người dùng tìm kiếm ngôi nhà lý tưởng dựa trên chất lượng cuộc sống. Chúng tôi cung cấp dịch vụ cho cả người dùng đã đăng nhập và chưa đăng nhập, với các quyền hạn khác nhau như mô tả dưới đây.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">2. Quyền Truy Cập Và Sử Dụng</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">
                    <strong>Người dùng chưa đăng nhập</strong>: Bạn có thể xem thông tin bất động sản, tìm kiếm và gợi ý dựa trên Chỉ số Sống. Tuy nhiên, bạn không thể đăng tin, lưu trữ tìm kiếm cá nhân hóa hoặc truy cập các tính năng nâng cao.
                </li>
                <li className="mb-2">
                    <strong>Người dùng đã đăng nhập</strong>: Ngoài việc xem và tìm kiếm, bạn có thể đăng tin về bất động sản, quản lý danh sách cá nhân, nhận gợi ý tùy chỉnh và tương tác với cộng đồng. Bạn phải cung cấp thông tin chính xác khi đăng ký và duy trì bảo mật tài khoản.
                </li>
                <li className="mb-2">
                    Bạn phải ít nhất 18 tuổi để sử dụng dịch vụ. Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện vi phạm.
                </li>
            </ul>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">3. Trách Nhiệm Của Người Dùng</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Bạn chịu trách nhiệm về nội dung bạn đăng, đảm bảo tính chính xác, không vi phạm pháp luật, không xâm phạm quyền sở hữu trí tuệ của người khác. Không được sử dụng nền tảng cho mục đích thương mại trái phép, spam hoặc lừa đảo. <span className="text-[#008DDA] font-semibold">timnha</span> có quyền xóa nội dung vi phạm mà không cần thông báo trước.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">4. Quyền Sở Hữu Trí Tuệ</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Tất cả nội dung trên <span className="text-[#008DDA] font-semibold">timnha</span>, bao gồm Chỉ số Sống, thiết kế và công nghệ, thuộc sở hữu của chúng tôi hoặc đối tác. Bạn được phép sử dụng cho mục đích cá nhân nhưng không được sao chép, phân phối hoặc khai thác thương mại mà không có sự cho phép bằng văn bản.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">5. Giới Hạn Trách Nhiệm</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> cung cấp dịch vụ "như hiện có" mà không bảo đảm tính chính xác hoặc liên tục. Chúng tôi không chịu trách nhiệm về thiệt hại phát sinh từ việc sử dụng nền tảng, bao gồm mất mát dữ liệu hoặc tranh chấp bất động sản. Giới hạn trách nhiệm của chúng tôi không vượt quá số tiền bạn đã thanh toán (nếu có).
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">6. Bảo Mật Và Dữ Liệu</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi cam kết bảo vệ dữ liệu cá nhân theo Chính sách Bảo mật. Bằng cách sử dụng dịch vụ, bạn đồng ý cho chúng tôi thu thập và sử dụng dữ liệu để cải thiện trải nghiệm.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">7. Thay Đổi Điều Khoản</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi có quyền sửa đổi Điều khoản này bất kỳ lúc nào. Các thay đổi sẽ được đăng tải trên website và có hiệu lực ngay lập tức. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">8. Giải Quyết Tranh Chấp</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Bất kỳ tranh chấp nào phát sinh từ Điều khoản này sẽ được giải quyết theo pháp luật Việt Nam, tại tòa án có thẩm quyền tại TP. Hồ Chí Minh.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">9. Liên Hệ</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nếu bạn có câu hỏi về Điều khoản Sử dụng, vui lòng liên hệ qua email: support@timnha.com.
            </p>
        </div>
    );
};

export default TermsOfUse;