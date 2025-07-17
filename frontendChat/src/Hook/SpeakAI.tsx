// hooks/useElevenLabsTTS.ts
import { useState } from "react";

const ELEVEN_LABS_API_KEY ="sk_e09a6541e32173cd72ca8e08fc7e887b0771dda2a21b987e"; // 🔑 Replace with your actual API key
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // 👤 Default voice (change to suit your preference)

export function useElevenLabsTTS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speakAI = async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVEN_LABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1", // or "eleven_multilingual_v2"
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err: any) {
      console.error("TTS Error:", err);
      setError(err.message || "Failed to speak");
    } finally {
      setLoading(false);
    }
  };

  return { speakAI, loading, error };
}
