import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientName, age, problem, hospitalName } = location.state || {};

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${patientName || "there"}! I'm MedoBot 🩺\n\nYou've been pre-registered at **${hospitalName}**. Help is on the way!\n\n${problem ? `I see your concern is: **${problem}**. Let me guide you right now.` : "Tell me what's happening and I'll guide you step by step."}`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSent, setAutoSent] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto send first aid for known problem once
  useEffect(() => {
    if (problem && !autoSent) {
      setAutoSent(true);
      setTimeout(() => sendMessage(null, `Give me first aid steps for: ${problem}`), 1500);
    }
  }, []);

  const sendMessage = async (e, autoText = null) => {
    if (e) e.preventDefault();
    const text = autoText || input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!autoText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          patientName,
          age,
          problem,
          hospitalName,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection issue. Call 108 immediately!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "How to do CPR?",
    "Someone is choking",
    "Bleeding won't stop",
    "I feel faint",
    "Chest pain steps",
  ];

  const renderText = (text) =>
    text.split("\n").map((line, j) => (
      <span key={j}>
        {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={k}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
        <br />
      </span>
    ));

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
        <div style={styles.headerCenter}>
          <div style={styles.botIconWrap}>🩺</div>
          <div>
            <div style={styles.botName}>MedoBot</div>
            <div style={styles.botSub}>
              <span style={styles.dot} /> AI First Aid Assistant
            </div>
          </div>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Patient banner */}
      <div style={styles.banner}>
        👤 <strong>{patientName}</strong> · Age {age} · Pre-registered at <strong>{hospitalName}</strong>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.row,
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.role === "assistant" && <div style={styles.avatar}>🤖</div>}
            <div
              style={{
                ...styles.bubble,
                ...(m.role === "user" ? styles.userBubble : styles.botBubble),
              }}
            >
              {renderText(m.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.row}>
            <div style={styles.avatar}>🤖</div>
            <div style={{ ...styles.bubble, ...styles.botBubble, letterSpacing: 3 }}>
              ● ● ●
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div style={styles.quickArea}>
        {quickActions.map((q, i) => (
          <button
            key={i}
            style={styles.quickBtn}
            onClick={() => sendMessage(null, q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the emergency or ask for help..."
          style={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </form>

      {/* Emergency footer */}
      <div style={styles.footer}>
        🚨 Life-threatening? Call <strong>108</strong> immediately
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0f1923",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #1a6b4a, #0d4a8a)",
    flexShrink: 0,
  },
  back: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
  },
  headerCenter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  botIconWrap: {
    fontSize: "26px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "50%",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  botName: { color: "#fff", fontWeight: "700", fontSize: "16px" },
  botSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dot: {
    width: "7px",
    height: "7px",
    background: "#4ade80",
    borderRadius: "50%",
    display: "inline-block",
  },
  banner: {
    background: "rgba(59,130,246,0.15)",
    borderBottom: "1px solid rgba(59,130,246,0.25)",
    padding: "8px 20px",
    color: "#93c5fd",
    fontSize: "12px",
    flexShrink: 0,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  row: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: "1.6",
    wordBreak: "break-word",
  },
  botBubble: {
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    borderBottomLeftRadius: "4px",
  },
  userBubble: {
    background: "linear-gradient(135deg, #1a6b4a, #0d4a8a)",
    color: "#fff",
    borderBottomRightRadius: "4px",
  },
  quickArea: {
    padding: "8px 14px",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
  },
  quickBtn: {
    background: "rgba(59,130,246,0.15)",
    border: "1px solid rgba(59,130,246,0.3)",
    color: "#93c5fd",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "25px",
    padding: "10px 18px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #1a6b4a, #0d4a8a)",
    border: "none",
    color: "#fff",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  footer: {
    background: "rgba(239,68,68,0.15)",
    borderTop: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    padding: "8px 16px",
    fontSize: "12px",
    textAlign: "center",
    flexShrink: 0,
  },
};