import { useEffect, useRef, useState } from "react";
import bookings from "../../../api/bookings";

export default function ChatPanel({ requestId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const lastId = useRef(0);

  async function refresh() {
    const list = await bookings.messages(requestId);
    setMessages(list);
    if (list.length) lastId.current = list[list.length - 1].id;
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000); // polling until Reverb is on
    return () => clearInterval(t);
  }, [requestId]);

  async function send() {
    if (!text.trim()) return;
    const body = text.trim();
    setText("");
    const msg = await bookings.sendMessage(requestId, body);
    setMessages((m) => [...m, msg]);
  }

  return (
    <div className="flex flex-col h-96 border rounded-xl bg-white">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id}
               className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                 m.sender_id === currentUserId
                   ? "ml-auto bg-blue-600 text-white"
                   : "bg-gray-100"
               }`}>
            {m.body}
          </div>
        ))}
      </div>
      <div className="border-t p-2 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && send()}
               className="flex-1 border rounded-lg px-3 py-2"
               placeholder="Message…" />
        <button onClick={send}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white">Send</button>
      </div>
    </div>
  );
}