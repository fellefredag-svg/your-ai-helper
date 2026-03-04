import { Bot } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
      <Bot size={16} />
    </div>
    <div className="bg-chat-ai border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TypingIndicator;
