import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {cn} from "@/lib/utils.ts";

interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatLauncher({ isOpen, onClick }: ChatLauncherProps) {
  return (
    <div className="fixed bottom-20 right-6 sm:bottom-6 z-50">
      {/* Pulse ring effect - only show when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-[#008DDA] animate-ping opacity-20"></div>
      )}

      {/* Glow effect */}
      {!isOpen && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
          style={{ backgroundColor: "#008DDA" }}
        ></div>
      )}

      <Button
        onClick={onClick}
        className="relative cursor-pointer h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,141,218,0.6)] group"
        style={{
          backgroundColor: isOpen ? "#0064A6" : "#008DDA",
          background: isOpen
            ? "#0064A6"
            : "linear-gradient(135deg, #008DDA 0%, #0064A6 100%)",
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "linear-gradient(135deg, #0064A6 0%, #004d7a 100%)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = "linear-gradient(135deg, #008DDA 0%, #0064A6 100%)";
          }
        }}
      >
        <div className={cn(
          "transition-all duration-500",
          isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
        )}>
          {isOpen ? (
            <X className="h-10 w-10 text-white transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <MessageCircle className="h-10 w-10 text-white transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>
      </Button>
    </div>
  );
}

