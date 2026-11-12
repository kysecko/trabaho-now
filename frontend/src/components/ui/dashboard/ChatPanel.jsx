import { useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import bookings from "../../../api/bookings";

export default function ChatPanel({ requestId, currentUserId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await bookings.messages(requestId);
        if (!cancelled) {
          setMessages(list);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Couldn't load messages");
      }
    }
    load();
    const t = setInterval(load, 4000); // Poll every 4 seconds
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [requestId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText("");
    try {
      const msg = await bookings.sendMessage(requestId, body);
      setMessages((m) => [...m, msg]);
    } catch (e) {
      setError(e.message || "Message failed");
      setText(body);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Dark blurred backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-125">
        
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-3">
          <h3 className="text-sm font-bold text-navy">Messages</h3>
          <button 
            onClick={onClose} 
            aria-label="Close chat" 
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Message List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa]">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 text-center">
              {error}
            </p>
          )}
          {messages.length === 0 && !error && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-gray-500">No messages yet</p>
              <p className="text-xs text-gray-400">Say hello to start the conversation.</p>
            </div>
          )}
          {messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div
                key={m.id}
                className={`max-w-[80%] wrap-break-word rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  mine
                    ? "ml-auto rounded-br-sm bg-[#ff4d00] text-white"
                    : "mr-auto rounded-bl-sm bg-white border border-gray-100 text-gray-800"
                }`}
              >
                {!mine && m.sender?.name && (
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {m.sender.name}
                  </p>
                )}
                {m.body}
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 bg-white p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Type a message…"
            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#ff4d00] focus:outline-none focus:ring-1 focus:ring-[#ff4d00]"
          />
          <button
            onClick={send}
            disabled={!text.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4d00] text-white transition hover:bg-[#e64500] disabled:opacity-50"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}