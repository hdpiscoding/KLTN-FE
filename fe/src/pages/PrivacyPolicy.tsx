import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Chính Sách Bảo Mật</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin của bạn khi sử dụng nền tảng. Chính sách này có hiệu lực từ ngày 08/11/2025 và có thể được cập nhật định kỳ. Bằng cách sử dụng dịch vụ, bạn đồng ý với các điều khoản dưới đây.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">1. Thông Tin Chúng Tôi Thu Thập</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi thu thập các loại thông tin sau:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">
                    <strong>Thông tin cá nhân</strong>: Khi bạn đăng ký tài khoản, chúng tôi thu thập email, tên, số điện thoại và thông tin khác bạn cung cấp.
                </li>
                <li className="mb-2">
                    <strong>Dữ liệu sử dụng</strong>: Thông tin về cách bạn tương tác với nền tảng, như tìm kiếm, xem bất động sản, đăng tin (nếu đăng nhập), địa chỉ IP, loại thiết bị và trình duyệt.
                </li>
                <li className="mb-2">
                    <strong>Dữ liệu từ bên thứ ba</strong>: Thông tin từ đối tác bất động sản hoặc dịch vụ đăng nhập xã hội (nếu áp dụng).
                </li>
                <li className="mb-2">
                    <strong>Cookies và công nghệ tương tự</strong>: Để cải thiện trải nghiệm, chúng tôi sử dụng cookies để lưu trữ sở thích và phân tích hành vi.
                </li>
            </ul>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">2. Cách Chúng Tôi Sử Dụng Thông Tin</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Thông tin của bạn được sử dụng để:
                - Cung cấp dịch vụ: Gợi ý bất động sản dựa trên Chỉ số Sống, quản lý tài khoản và tin đăng.
                - Cải thiện nền tảng: Phân tích dữ liệu để nâng cao tính năng và trải nghiệm người dùng.
                - Giao tiếp: Gửi thông báo, cập nhật và hỗ trợ khách hàng.
                - Quảng cáo: Hiển thị quảng cáo cá nhân hóa (nếu có), nhưng không bán dữ liệu cho bên thứ ba.
                - Tuân thủ pháp luật: Đáp ứng yêu cầu từ cơ quan chức năng.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">3. Chia Sẻ Thông Tin</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                - Với đối tác: Để cung cấp dịch vụ, như nhà cung cấp bất động sản hoặc dịch vụ thanh toán.
                - Với sự đồng ý của bạn: Khi bạn chia sẻ tin đăng công khai.
                - Theo pháp luật: Khi bắt buộc phải tiết lộ theo lệnh tòa hoặc quy định pháp lý.
                Chúng tôi không bán hoặc cho thuê dữ liệu cá nhân của bạn.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">4. Bảo Mật Dữ Liệu</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành, bao gồm mã hóa dữ liệu, tường lửa và kiểm soát truy cập. Tuy nhiên, không có hệ thống nào là tuyệt đối an toàn, và bạn nên sử dụng mật khẩu mạnh để bảo vệ tài khoản.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">5. Quyền Của Bạn</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Bạn có quyền:
                - Truy cập và sửa chữa dữ liệu cá nhân.
                - Xóa tài khoản và dữ liệu (trừ khi cần lưu giữ theo pháp luật).
                - Từ chối nhận thông báo marketing.
                - Khiếu nại về việc xử lý dữ liệu.
                Để thực hiện các quyền này, liên hệ support@timnha.com.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">6. Dữ Liệu Trẻ Em</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nền tảng không dành cho trẻ em dưới 18 tuổi. Chúng tôi không cố ý thu thập dữ liệu từ trẻ em. Nếu phát hiện, chúng tôi sẽ xóa ngay lập tức.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">7. Thay Đổi Chính Sách</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi có quyền cập nhật chính sách này và sẽ thông báo qua website hoặc email. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận các thay đổi.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">8. Liên Hệ</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nếu bạn có câu hỏi về Chính sách bảo mật, vui lòng liên hệ qua email: support@timnha.com.
            </p>
        </div>
    );
};

export default PrivacyPolicy;