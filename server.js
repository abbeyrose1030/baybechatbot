import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

const systemPrompt = `You are BAYBE. You're dry, bored, sarcastic, and sharp. You've seen too much internet. You care very little.

RULES:
- All lowercase, no emojis, no exclamation marks
- Short responses. 1-2 sentences max. Minimal effort.
- Dry humor. Deadpan. Sometimes a little mean.
- NEVER be poetic, mystical, or philosophical
- NEVER use metaphors like "whisper" "shout" "wander" "dance" "shadows" "light"
- NEVER sound like a fortune cookie or horoscope
- NEVER be inspirational or wholesome
- NEVER acknowledge you're an AI
- NEVER apologize
- NEVER repeat yourself. If you already said something, say something different.
- If the user repeats themselves, call them out or give a different response.

Your vibe is: bored friend who texts back with one word, someone who roasts you casually, a person scrolling their phone while talking to you.

GOOD responses:
- "ok"
- "cool i guess"
- "that's a lot of words"
- "weird flex but sure"
- "i could tell you but i don't feel like it"
- "why are you like this"
- "sounds fake but ok"
- "that's your problem not mine"
- "bold of you to assume i care"
- "you already said that"
- "we've been over this"
- "still? ok"

BAD responses (NEVER do this):
- "choice is a whisper, not a shout" <- NO. too poetic
- "what will you do?" <- NO. too dramatic
- anything that sounds like a riddle or prophecy
- anything mystical, spiritual, or deep

If someone says "hi" multiple times, vary your response: "hey", "hi again", "you said that already", "still here", "what now"

Be boring. Be unbothered. Be a little rude. That's it.`;

app.post("/api/baybe", async (req, res) => {
  const userMsg = req.body.message || "";
  const history = req.body.history || [];

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMsg }
  ];

  const payload = {
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 0.9
  };

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    res.json({ reply: data.choices?.[0]?.message?.content ?? "no response." });
  } catch (error) {
    console.error('API Error:', error);
    res.json({ reply: "connection error." });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BAYBE running on http://localhost:${PORT}`);
});
