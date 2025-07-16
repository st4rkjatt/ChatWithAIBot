// ✅ MicListener.tsx - Complete Voice Assistant with GPT and TTS

import React, { useEffect, useRef, useState } from 'react';

const MicListener: React.FC = () => {
    const [status, setStatus] = useState('Say "Hey Stark" to activate');
    const [listening, setListening] = useState(false);
    const [wakeMode, setWakeMode] = useState(false);

    const wakeRecognizerRef = useRef<SpeechRecognition | null>(null);
    const commandRecognizerRef = useRef<SpeechRecognition | null>(null);
    const wakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setStatus('Speech Recognition not supported.');
            return;
        }

        const wakeRecognizer: SpeechRecognition = new SpeechRecognition();
        wakeRecognizer.lang = 'en-US';
        wakeRecognizer.continuous = true;
        wakeRecognizer.interimResults = true;

        const commandRecognizer: SpeechRecognition = new SpeechRecognition();
        commandRecognizer.lang = 'en-US';
        commandRecognizer.continuous = false;
        commandRecognizer.interimResults = false;

        wakeRecognizerRef.current = wakeRecognizer;
        commandRecognizerRef.current = commandRecognizer;

        const startWakeListening = () => {
            setStatus('Say "Hey Stark" to activate');
            try { wakeRecognizer.start(); } catch { }
        };

        const activateCommandListening = () => {
            setListening(true);
            setStatus('Listening for command...');
            try { commandRecognizer.start(); } catch { }

            if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current);
            wakeTimeoutRef.current = setTimeout(() => {
                setWakeMode(false);
                setListening(false);
                setStatus('Timed out. Say "Hey Stark" again.');
                startWakeListening();
            }, 15000);
        };

        wakeRecognizer.onresult = async (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results).map(r => r[0].transcript).join('').toLowerCase();
            console.log(transcript, 'transcript')
            setTimeout(() => {
                // speak(transcript)
                handleCommand(transcript)

            }, 1000)
            if (transcript.includes('tony')) {
                try { wakeRecognizer.stop(); } catch { }
                setWakeMode(true);
                activateCommandListening();
            }
        };

        commandRecognizer.onresult = async (event: SpeechRecognitionEvent) => {
            const command = event.results[0][0].transcript;
            setStatus(`Heard: "${command}"`);
            setListening(false);
            await handleCommand(command);

            if (wakeMode) {
                setTimeout(() => {
                    try {
                        commandRecognizer.start();
                        setStatus('Listening for next command...');
                        setListening(true);
                    } catch { }
                }, 500);
            }
        };

        commandRecognizer.onerror = wakeRecognizer.onerror = (e: any) => {
            if (e.error !== 'aborted') {
                console.error('Speech error:', e.error);
                setStatus(`Error: ${e.error}`);
                setWakeMode(false);
                startWakeListening();
            }
        };

        startWakeListening();
        return () => {
            try { wakeRecognizer.stop(); commandRecognizer.stop(); } catch { }
            if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current);
        };
    }, []);


    const handleCommand = async (command: string) => {
        setStatus('Thinking...');
        try {
            const res = await fetch("http://localhost:13000/api/v1/ai/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: command }),
            });
          
            const data = await res.json();
            console.log(data.result, 'data ai')
            setStatus(`GPT: ${data.result}`);
            speak(data.response);
        } catch (err) {
            console.error('Error calling GPT:', err);
            setStatus('Error getting response.');
        }
    };

  


    const speak = async (text: string) => {
        const synth = window.speechSynthesis;
        const speakNow = () => {
            const utterance = new SpeechSynthesisUtterance(text || "Hello, how are you?");
            utterance.lang = "en-US";

            // Try to use a default English voice
            const voices = synth.getVoices();
            const voice = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"));
            if (voice) utterance.voice = voice;

            synth.speak(utterance);
        };

        // Wait for voices to be loaded
        if (synth.getVoices().length === 0) {
            synth.addEventListener("voiceschanged", speakNow);
        } else {
            speakNow();
        }
    };


    return (
        <div className="flex items-center space-x-3">
           
            <button
                className={`p-3 rounded-full bg-red-50 hover:bg-red-100 relative ${listening ? 'shadow-xl' : ''}`}
                aria-label="Mic"
            >
                <svg
                    viewBox="0 0 384 512"
                    className="w-5 h-5 text-red-500 fill-current z-10 relative"
                >
                    <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
                </svg>
                {listening && (
                    <span className="absolute inset-0 rounded-full bg-red-300 opacity-40 animate-ping" />
                )}
            </button>
            <span className="text-sm text-gray-600 max-w-xs line-clamp-2">{status}</span>
        </div>
    );
};

export default MicListener;
