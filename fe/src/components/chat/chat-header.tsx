import { Bot, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onMinimize: () => void;
}

export function ChatHeader({ onMinimize }: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-t-lg"
      style={{ backgroundColor: "#008DDA" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
          <Bot className="h-6 w-6" style={{ color: "#008DDA" }} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Trợ lý AI</h3>
          <p className="text-white/80 text-xs">Luôn sẵn sàng hỗ trợ bạn</p>
        </div>
      </div>
      <Button
        onClick={onMinimize}
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20 cursor-pointer"
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  );
}

