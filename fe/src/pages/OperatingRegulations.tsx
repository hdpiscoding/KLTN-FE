import React from 'react';

const OperatingRegulations: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Quy Chế Hoạt Động</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Quy chế hoạt động này quy định các nguyên tắc và quy trình vận hành của nền tảng <span className="text-[#008DDA] font-semibold">timnha</span>. Bằng cách sử dụng dịch vụ, bạn đồng ý tuân thủ các quy định dưới đây. Quy chế này có hiệu lực từ ngày 08/11/2025 và có thể được cập nhật định kỳ để phù hợp với sự phát triển của nền tảng.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">1. Giới Thiệu</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> là nền tảng tìm kiếm và gợi ý bất động sản dựa trên Chỉ số Sống, nhằm giúp người dùng tìm kiếm và giao dịch bất động sản một cách hiệu quả và minh bạch. Nền tảng hỗ trợ cả người dùng chưa đăng nhập và đã đăng nhập với các quyền hạn khác nhau để đảm bảo an toàn và tiện lợi.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">2. Quyền Hạn Người Dùng</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">
                    <strong>Người dùng chưa đăng nhập</strong>: Có thể xem thông tin bất động sản, tìm kiếm và nhận gợi ý dựa trên Chỉ số Sống. Không được phép đăng tin, bình luận hoặc truy cập các tính năng cá nhân hóa nâng cao.
                </li>
                <li className="mb-2">
                    <strong>Người dùng đã đăng nhập</strong>: Ngoài các quyền của người dùng chưa đăng nhập, có thể đăng tin bất động sản, quản lý tin đăng, lưu trữ tìm kiếm, nhận thông báo cá nhân hóa và tương tác với người dùng khác. Người dùng phải xác thực tài khoản để đăng tin.
                </li>
                <li className="mb-2">
                    Tất cả người dùng phải tuân thủ pháp luật Việt Nam và không sử dụng nền tảng cho các hoạt động bất hợp pháp.
                </li>
            </ul>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">3. Quy Định Về Đăng Tin</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Người dùng đã đăng nhập có thể đăng tin bất động sản miễn phí hoặc theo các gói dịch vụ (nếu áp dụng). Tin đăng phải bao gồm thông tin chính xác về vị trí, giá cả, diện tích, hình ảnh và mô tả chi tiết. <span className="text-[#008DDA] font-semibold">timnha</span> có quyền kiểm duyệt và xóa tin vi phạm, bao gồm tin giả mạo, trùng lặp hoặc vi phạm quyền sở hữu. Người dùng chịu trách nhiệm pháp lý về nội dung tin đăng.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">4. Quy Trình Xử Lý Khiếu Nại</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nếu phát hiện tin đăng vi phạm, người dùng có thể báo cáo qua form liên hệ. Đội ngũ <span className="text-[#008DDA] font-semibold">timnha</span> sẽ xem xét và xử lý trong vòng 48 giờ. Các khiếu nại về giao dịch bất động sản sẽ được chuyển hướng đến cơ quan chức năng nếu cần thiết. Chúng tôi khuyến khích người dùng xác minh thông tin trước khi giao dịch.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">5. Bảo Vệ Dữ Liệu Và An Ninh</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> cam kết bảo vệ dữ liệu người dùng theo quy định pháp luật. Chúng tôi sử dụng các biện pháp an ninh để ngăn chặn truy cập trái phép. Người dùng không được chia sẻ thông tin tài khoản hoặc sử dụng phần mềm độc hại để can thiệp vào hệ thống.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">6. Trách Nhiệm Của Nền Tảng</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> cung cấp nền tảng "như hiện có" và không chịu trách nhiệm về các giao dịch giữa người dùng. Chúng tôi nỗ lực đảm bảo tính chính xác của Chỉ số Sống dựa trên dữ liệu từ nguồn uy tín, nhưng không bảo đảm tuyệt đối.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">7. Thay Đổi Quy Chế</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi có quyền cập nhật Quy chế này và sẽ thông báo qua website hoặc email. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">8. Liên Hệ</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nếu bạn có câu hỏi về Quy chế hoạt động, vui lòng liên hệ qua email: support@timnha.com.
            </p>
        </div>
    );
};

export default OperatingRegulations;