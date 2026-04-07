import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = { role: "bot", content: data.reply };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Friendly MBBS_BY _Chaithu_cr7</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "user" ? styles.userBubble : styles.botBubble
            }
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your health question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    margin: "20px",
  },
  chatBox: {
    flex: 1,
    width: "90%",
    maxWidth: "600px",
    overflowY: "auto",
    padding: "10px",
  },
  userBubble: {
    backgroundColor: "#2563eb",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    margin: "5px",
    alignSelf: "flex-start",
  },
  inputArea: {
    display: "flex",
    width: "90%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "none",
  },
  button: {
    marginLeft: "10px",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default App;