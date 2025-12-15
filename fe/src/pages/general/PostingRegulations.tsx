import React from 'react';

const PostingRegulations: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Quy Định Đăng Tin</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Quy định đăng tin này áp dụng cho tất cả người dùng đã đăng nhập trên nền tảng <span className="text-[#008DDA] font-semibold">timnha</span> khi đăng tải thông tin bất động sản. Mục tiêu là đảm bảo tính minh bạch, chính xác và tuân thủ pháp luật, giúp xây dựng một cộng đồng đáng tin cậy. Quy định này có hiệu lực từ ngày 08/11/2025 và có thể được cập nhật định kỳ.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">1. Điều Kiện Đăng Tin</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">
                    Chỉ người dùng đã đăng nhập và xác thực tài khoản mới được phép đăng tin bất động sản.
                </li>
                <li className="mb-2">
                    Mỗi tài khoản có thể đăng tin miễn phí với số lượng giới hạn (theo chính sách hiện hành), hoặc nâng cấp gói premium để đăng thêm.
                </li>
                <li className="mb-2">
                    Tin đăng phải liên quan đến bất động sản (nhà ở, đất đai, văn phòng, v.v.) và không được sử dụng cho mục đích quảng cáo khác.
                </li>
            </ul>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">2. Nội Dung Tin Đăng</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Tin đăng phải bao gồm các thông tin bắt buộc và chính xác:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">Vị trí chính xác (tỉnh/thành phố, quận/huyện, địa chỉ cụ thể).</li>
                <li className="mb-2">Giá cả rõ ràng, không lừa dối hoặc che giấu chi phí ẩn.</li>
                <li className="mb-2">Diện tích, loại hình bất động sản, tình trạng pháp lý (giấy tờ sở hữu, quy hoạch).</li>
                <li className="mb-2">Hình ảnh thực tế (tối thiểu 3 ảnh), không sử dụng hình ảnh giả mạo hoặc sao chép từ nguồn khác mà không có quyền.</li>
                <li className="mb-2">Mô tả chi tiết, không chứa thông tin sai lệch, phân biệt đối xử hoặc vi phạm pháp luật Việt Nam.</li>
            </ul>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Cấm đăng tin chứa nội dung: Quảng cáo lừa đảo, bất hợp pháp, khiêu dâm, bạo lực, hoặc xâm phạm quyền riêng tư của người khác.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">3. Quy Trình Đăng Tin</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                - Bước 1: Đăng nhập và truy cập phần "Đăng Tin".
                - Bước 2: Điền đầy đủ thông tin theo form hướng dẫn.
                - Bước 3: <span className="text-[#008DDA] font-semibold">timnha</span> sẽ kiểm duyệt tự động và thủ công (nếu cần) trước khi tin được hiển thị công khai.
                - Thời gian phê duyệt: Thường trong vòng 24 giờ. Tin vi phạm sẽ bị từ chối và thông báo lý do.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">4. Quản Lý Tin Đăng</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Người dùng có thể chỉnh sửa, gia hạn hoặc xóa tin đăng của mình. <span className="text-[#008DDA] font-semibold">timnha</span> có quyền xóa hoặc tạm ngưng tin đăng nếu phát hiện vi phạm mà không cần thông báo trước. Người dùng lặp lại vi phạm có thể bị khóa tài khoản.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">5. Trách Nhiệm Của Người Đăng Tin</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Bạn chịu hoàn toàn trách nhiệm pháp lý về nội dung tin đăng. <span className="text-[#008DDA] font-semibold">timnha</span> chỉ là nền tảng trung gian và không chịu trách nhiệm về các giao dịch phát sinh. Khuyến nghị xác minh thông tin trước khi giao dịch.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">6. Xử Lý Vi Phạm</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Vi phạm quy định có thể dẫn đến: Cảnh cáo, xóa tin, tạm ngưng tài khoản hoặc chấm dứt vĩnh viễn. Người dùng có quyền khiếu nại qua support@timnha.com.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">7. Thay Đổi Quy Định</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi có quyền cập nhật quy định này và sẽ thông báo qua website hoặc email. Việc tiếp tục đăng tin đồng nghĩa với việc chấp nhận các thay đổi.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">8. Liên Hệ</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Nếu bạn có câu hỏi về Quy định đăng tin, vui lòng liên hệ qua email: support@timnha.com.
            </p>
        </div>
    );
};

export default PostingRegulations;