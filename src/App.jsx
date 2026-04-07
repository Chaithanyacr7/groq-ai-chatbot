import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,

        // ✅ CRITICAL FIX (forces new API)
        httpOptions: { apiVersion: "v1" },
      });

      const systemPrompt = `
You are a friendly MBBS-level medical assistant.
Give simple, safe, and accurate medical advice.
Keep answers short and clear.
Always include: "⚠️ This is not a substitute for professional medical advice."
`;

      const res = await ai.models.generateContent({
        // ✅ USE NEW MODEL (2026 WORKING)
        model: "gemini-2.5-flash",

        contents: `${systemPrompt}\nUser: ${userMessage}`,
      });

      const reply = res.text || "No response received.";

      setChat((prev) => [...prev, { role: "ai", text: reply }]);

    } catch (err) {
      console.error(err);

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "❌ Error: " +
            (err?.message || "Check model/API version"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
      <h1>🩺 Friendly MBBS AI</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
          background: "#fafafa",
        }}
      >
        {chat.length === 0 && (
          <p style={{ color: "#888" }}>
            Ask any medical question to get started...
          </p>
        )}

        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "12px",
                background:
                  msg.role === "user" ? "#007bff" : "#eaeaea",
                color: msg.role === "user" ? "#fff" : "#000",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && <p>🤖 MBBS AI is thinking...</p>}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          placeholder="Ask medical question..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            marginLeft: "10px",
            padding: "12px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "#fff",
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default App;