"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a short poem about the ocean",
  "What are the best practices in React?",
  "Help me plan a 7-day trip to Japan",
];

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
      />
    </svg>
  );
}

export default function Chat() {
  // 🌗 Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea as the user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      const botMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🧠 Format AI messages with basic markdown-like rendering
  const formatMessage = (text: string) => {
    if (!text) return "";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const bolded = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const paragraphs = bolded
      .split("\n\n")
      .map(
        (para) =>
          `<p style="margin-bottom:0.65rem">${para.replace(/\n/g, "<br/>")}</p>`,
      );
    return paragraphs.join("");
  };

  const isEmpty = messages.length === 0 && !loading;
  const dm = darkMode;

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        dm ? "bg-[#212121] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* ── Header ── */}
      <header
        className={`flex shrink-0 justify-between items-center px-5 py-3 border-b ${
          dm ? "border-neutral-700" : "border-neutral-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base select-none ${
              dm ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            ✦
          </div>
          <h1 className="font-semibold text-base tracking-tight">
            My AI Assistant
          </h1>
        </div>

        <button
          onClick={toggleTheme}
          title={dm ? "Switch to light mode" : "Switch to dark mode"}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            dm
              ? "hover:bg-neutral-700 text-neutral-300"
              : "hover:bg-neutral-100 text-neutral-600"
          }`}
        >
          {dm ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Welcome / Empty State */
          <div className="flex flex-col items-center justify-center h-full px-4 pb-10">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5 select-none ${
                dm ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              ✦
            </div>
            <h2 className="text-2xl font-bold mb-1.5">How can I help you?</h2>
            <p
              className={`text-sm mb-8 ${
                dm ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Ask anything — I&apos;m here to assist.
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer ${
                    dm
                      ? "border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                      : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="py-8 space-y-5 px-4 max-w-6xl mx-auto w-full">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold select-none ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : dm
                        ? "bg-white text-black"
                        : "bg-black text-white"
                  }`}
                >
                  {msg.role === "user" ? "U" : "✦"}
                </div>

                {/* Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : dm
                        ? "bg-neutral-800 text-neutral-100 rounded-tl-sm"
                        : "bg-neutral-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(msg.content),
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Animated typing indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm select-none ${
                    dm ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  ✦
                </div>
                <div
                  className={`px-4 py-3.5 rounded-2xl rounded-tl-sm ${
                    dm ? "bg-neutral-800" : "bg-neutral-100"
                  }`}
                >
                  <div className="flex gap-1.5 items-center h-4">
                    <span
                      className="w-2 h-2 rounded-full bg-current opacity-50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-current opacity-50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-current opacity-50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div
        className={`px-4 pt-3 pb-5 border-t shrink-0 ${
          dm ? "border-neutral-700" : "border-neutral-200"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all ${
              dm
                ? "bg-neutral-800 border-neutral-600 focus-within:border-neutral-400"
                : "bg-neutral-50 border-neutral-200 shadow-sm focus-within:border-neutral-400"
            }`}
          >
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed placeholder:opacity-40"
              style={{ maxHeight: "200px" }}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : dm
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <SendIcon />
            </button>
          </div>

          <p
            className={`text-xs text-center mt-2 ${
              dm ? "text-neutral-600" : "text-neutral-400"
            }`}
          >
            <kbd className="font-mono">Enter</kbd> to send ·{" "}
            <kbd className="font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
