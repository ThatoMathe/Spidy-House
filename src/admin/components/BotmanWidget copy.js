import React, {useContext, useState, useRef, useEffect} from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { Send, MessageCircle, Info } from "lucide-react"; // Importing the 'Info' icon
import { AuthContext } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function ChatWidget() {
  const { settings } = useSettings();
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);  // Toggle commands
  const messagesEndRef = useRef(null);
  const location = useLocation(); // Get the current route
  const shouldShowChatWidget = !["/", "/admin/login", "/admin/register"].includes(location.pathname);

  useEffect(() => {
    if (user && user.UserName) {
      setMessages([
        { id: 1, sender: "bot", text: `Hi ${user.UserName}! How can I help you?` }
      ]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const appendMessage = (text, sender) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text }
    ]);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    appendMessage(trimmed, "user");
    setInput("");

    try {
      
const res = await fetch(
  `${settings.api_url}/api/v1/botman/botman.php?message=${encodeURIComponent(trimmed)}`,
  {
    credentials: 'include' // Include session/cookies
  }
);
const json = await res.json();


      if (json.messages && Array.isArray(json.messages)) {
        json.messages.forEach((msg) => {
          if (msg.type === "text" && msg.text) {
            appendMessage(msg.text, "bot");
          }
        });
      } else {
        appendMessage("Unexpected response format.", "bot");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      appendMessage("Failed to connect to the server.", "bot");
    }
  };

    // Check if the current route is either `/admin/login` or home (`/`)
  if (!shouldShowChatWidget) return null; // don't render the widget

  return (
    shouldShowChatWidget && ( // Render only if the condition is true
    <div
      className="position-fixed bottom-0 end-0 m-3"
      style={{ zIndex: 9999 }}
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle shadow-lg"
          aria-label="Open chat"
          style={{ width: "50px", height: "50px" }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div
          className="d-flex flex-column shadow-lg border-0 rounded-4"
          style={{
            width: "22rem",
            height: "30rem",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid #dee2e6"
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 rounded-top-4 text-white">
            <span className="fw-bold text-black">AI Assistant</span>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Show commands layer below the header */}
          {showCommands && (
            <div
              className="p-3 bg-white border-top"
              style={{
                borderBottom: "1px solid #dee2e6",
                maxHeight: "7rem", 
                overflowY: "auto",
                fontSize: "0.8rem"
              }}
            >
              <strong className="d-block mb-2">Available Commands:</strong>
              <ul className="mb-0 ps-3 small">
                <li><code>help</code> – Show all commands</li>
                <li><code>time</code> – Get current time</li>
                <li><code>weather [city]</code> – Get weather info</li>
                <li><code>joke</code> – Tell a joke</li>
                {/* Add more commands as required */}
              </ul>
            </div>
          )}

          <div
            className="flex-grow-1 p-3 overflow-auto"
            style={{ fontSize: "0.9rem" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-2 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-3 ${
                    msg.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"
                  }`}
                  style={{
                    maxWidth: "75%",
                    wordWrap: "break-word"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className="d-flex align-items-center gap-2 p-3 border-top">
            {/* Commands Button */}
            
              <Info size={35} 
              className="btn p-2 btn-sm btn-outline-secondary"
               onClick={() => setShowCommands((prev) => !prev)}
              />

            <input
              className="form-control form-control-sm rounded-pill"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-sm btn-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
     )
  );
}
