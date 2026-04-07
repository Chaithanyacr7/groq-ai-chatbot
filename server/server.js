import "dotenv/config";

import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

console.log("ENV CHECK:", process.env.GROQ_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (THIS WAS MISSING)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a friendly MBBS-level medical assistant.

Speak naturally like ChatGPT:
- Be conversational, not robotic
- Be calm and helpful
- Give practical advice

End every answer with:
"This is not a substitute for professional medical advice."
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});