export function ChatTypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="h-8 w-8 rounded-full bg-[#008DDA] flex items-center justify-center flex-shrink-0">
        <svg
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <div className="px-4 py-3 rounded-2xl bg-gray-100 rounded-tl-none">
          <div className="flex gap-1">
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

