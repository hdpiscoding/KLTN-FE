import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="max-w-4xl my-4 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">Về Chúng Tôi</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chào mừng bạn đến với <span className="text-[#008DDA] font-semibold">timnha</span>, nền tảng tiên phong trong việc tìm kiếm và gợi ý bất động sản dựa trên Chỉ số Sống – một chỉ số toàn diện đánh giá chất lượng cuộc sống tại từng khu vực. Chúng tôi không chỉ giúp bạn tìm nhà, mà còn hỗ trợ bạn tìm kiếm một cuộc sống lý tưởng, nơi mà sự tiện nghi, an toàn và hạnh phúc được đặt lên hàng đầu.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Sứ Mệnh Của Chúng Tôi</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                <span className="text-[#008DDA] font-semibold">timnha</span> được thành lập với sứ mệnh cách mạng hóa thị trường bất động sản bằng cách kết hợp công nghệ thông minh và dữ liệu thực tế. Chúng tôi tin rằng việc chọn nhà không chỉ dựa vào giá cả hay vị trí, mà còn phải xem xét các yếu tố ảnh hưởng đến chất lượng sống hàng ngày như môi trường xanh sạch, hệ thống giao thông, tiện ích y tế, giáo dục, an ninh và cộng đồng thân thiện. Chỉ số Sống của chúng tôi được xây dựng dựa trên dữ liệu từ các nguồn uy tín, giúp người dùng dễ dàng so sánh và lựa chọn bất động sản phù hợp với lối sống cá nhân.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Đội Ngũ Đằng Sau</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi là một đội ngũ đam mê gồm các chuyên gia công nghệ, nhà phân tích dữ liệu, chuyên viên bất động sản và các nhà nghiên cứu đô thị. Với kinh nghiệm phong phú từ các dự án lớn tại Việt Nam và quốc tế, chúng tôi cam kết mang đến những giải pháp sáng tạo, minh bạch và dễ tiếp cận. Đội ngũ của chúng tôi luôn cập nhật xu hướng mới nhất, từ AI phân tích dữ liệu đến các công cụ trực quan hóa, để đảm bảo bạn nhận được những gợi ý chính xác và kịp thời.
            </p>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Giá Trị Cốt Lõi</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 leading-relaxed">
                <li className="mb-2">
                    <strong>Tập Trung Vào Người Dùng</strong>: Mọi tính năng đều được thiết kế để mang lại giá trị thực sự cho bạn, từ tìm kiếm nhanh chóng đến gợi ý cá nhân hóa.
                </li>
                <li className="mb-2">
                    <strong>Minh Bạch Và Đáng Tin Cậy</strong>: Chúng tôi sử dụng dữ liệu từ nguồn mở và đối tác uy tín, không thiên vị hay quảng cáo trá hình.
                </li>
                <li className="mb-2">
                    <strong>Bền Vững Và Xã Hội</strong>: Chúng tôi ưu tiên các bất động sản thân thiện với môi trường, góp phần xây dựng cộng đồng sống tốt hơn.
                </li>
                <li className="mb-2">
                    <strong>Đổi Mới Liên Tục</strong>: Công nghệ là cốt lõi, và chúng tôi không ngừng cải tiến để mang đến trải nghiệm tốt nhất.
                </li>
            </ul>

            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Tầm Nhìn Tương Lai</h4>
            <p className="mb-6 text-gray-700 leading-relaxed">
                Chúng tôi hướng tới việc trở thành nền tảng hàng đầu tại Việt Nam và khu vực Đông Nam Á, nơi mà mọi người có thể dễ dàng tìm thấy "ngôi nhà mơ ước" dựa trên Chỉ số Sống. Trong tương lai, chúng tôi sẽ mở rộng tính năng như tích hợp thực tế ảo (VR) để thăm quan nhà, dự báo xu hướng thị trường và hợp tác với các nhà phát triển bất động sản để tạo ra những dự án sống xanh.
            </p>

            <p className="mb-6 text-gray-700 leading-relaxed">
                Cảm ơn bạn đã tin tưởng và đồng hành cùng <span className="text-[#008DDA] font-semibold">timnha</span>. Hãy cùng chúng tôi khám phá một cuộc sống chất lượng hơn hôm nay!
            </p>
        </div>
    );
};

export default AboutUs;