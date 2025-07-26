import React, { useState } from "react";

function SpeakAIEleven() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSpeak = async () => {
    const response = await fetch("http://localhost:13000/api/v1/ai/eleven-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ElevenLabs TTS Demo</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleSpeak}>Speak</button>
      {audioUrl && <audio src={audioUrl} controls autoPlay />}
    </div>
  );
}

export default SpeakAIEleven;

