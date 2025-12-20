import { Bot, Minus, MessageCircle, Home, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";
import type { ChatContext } from "@/store/chatStore";
import { useChatContext } from "@/hooks/chat";

interface ChatHeaderProps {
  onMinimize: () => void;
}

const contextConfig: Record<ChatContext, {
  icon: typeof MessageCircle;
  label: string;
  description: string;
  color: string;
}> = {
  general: {
    icon: MessageCircle,
    label: "Tư vấn chung",
    description: "Hỏi về bất động sản",
    color: "#fff",
  },
  insight: {
    icon: Home,
    label: "Phân tích BĐS",
    description: "Chi tiết bất động sản",
    color: "#FFD700",
  },
  prediction: {
    icon: TrendingUp,
    label: "Định giá nhà",
    description: "Phân tích định giá",
    color: "#90EE90",
  },
};

export function ChatHeader({ onMinimize }: ChatHeaderProps) {
  const currentContext = useChatStore((state) => state.currentContext);
  const { switchToGeneral } = useChatContext();
  const config = contextConfig[currentContext];
  const ContextIcon = config.icon;
  const isNotGeneral = currentContext !== "general";

  const handleBackToGeneral = () => {
    switchToGeneral();
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-t-lg"
      style={{ backgroundColor: "#008DDA" }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Back button - only show when not in general context */}
        {isNotGeneral && (
          <Button
            onClick={handleBackToGeneral}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 cursor-pointer flex-shrink-0 h-8 w-8"
            title="Quay về tư vấn chung"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Bot className="h-6 w-6" style={{ color: "#008DDA" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-lg">Trợ lý AI</h3>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm"
              title={config.description}
            >
              <ContextIcon
                className="h-3.5 w-3.5"
                style={{ color: config.color }}
              />
              <span className="text-white/90 text-xs font-medium whitespace-nowrap">
                {config.label}
              </span>
            </div>
          </div>
          <p className="text-white/80 text-xs truncate">{config.description}</p>
        </div>
      </div>
      <Button
        onClick={onMinimize}
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20 cursor-pointer flex-shrink-0"
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
}

