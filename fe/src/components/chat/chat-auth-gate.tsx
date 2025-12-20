import { Bot, LogIn, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const sampleQuestions = [
  "Tầm 2–3 tỷ ở TP.HCM nên mua khu nào?",
  "Ở TP.HCM, căn hộ hay nhà phố dễ sống hơn?",
  "Tư vấn mua nhà lần đầu",
  "Khu nào ở TP.HCM phù hợp gia đình trẻ?",
];

export function ChatAuthGate() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-start h-full px-6 py-6 text-center overflow-y-auto">
      {/* Bot Icon with gradient background */}
      <div className="relative mb-4">
        <div
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: "linear-gradient(135deg, #008DDA 0%, #0064A6 100%)",
          }}
        >
          <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full border-4 border-white"></div>
      </div>

      {/* Welcome Text */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
        Xin chào! 👋
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 max-w-sm">
        Đăng nhập để trò chuyện với trợ lý AI và nhận tư vấn bất động sản phù hợp với nhu cầu của bạn
      </p>

      {/* Sample Questions */}
      <div className="w-full mb-4 sm:mb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">Tôi có thể giúp bạn:</span>
        </div>
        {sampleQuestions.map((question, index) => (
          <div
            key={index}
            className="cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm text-gray-700 border border-gray-200 hover:border-[#008DDA]/30 transition-all cursor-default group"
          >
            <div className="flex items-start gap-2">
              <span className="text-[#008DDA] mt-0.5 group-hover:scale-110 transition-transform">•</span>
              <span className="flex-1">{question}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Login Button */}
      <Button
        onClick={() => navigate("/dang-nhap")}
        className="w-full group relative overflow-hidden cursor-pointer"
        style={{ backgroundColor: "#008DDA" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0064A6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#008DDA";
        }}
      >
        <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        Đăng nhập để trò chuyện
      </Button>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 mt-4">
        Miễn phí và không giới hạn câu hỏi
      </p>
    </div>
  );
}

