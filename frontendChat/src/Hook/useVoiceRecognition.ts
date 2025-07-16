import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  confidence: number;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // recognition.onresult = (event: any) => {
      //   const result = event.results[event.results.length - 1];
      //   const speechResult: VoiceRecognitionResult = {
      //     transcript: result[0].transcript,
      //     confidence: result[0].confidence,
      //     isFinal: result.isFinal
      //   };

      //   setTranscript(speechResult.transcript);
      //   setConfidence(speechResult.confidence);
      // };
      // Add inside your useVoiceRecognition hook
      let debounceTimer: NodeJS.Timeout;

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const speechResult: VoiceRecognitionResult = {
          transcript: result[0].transcript.trim(),
          confidence: result[0].confidence,
          isFinal: result.isFinal,
        };

        if (debounceTimer) clearTimeout(debounceTimer);

        // Wait for 1.5 seconds after last speech before confirming
        debounceTimer = setTimeout(() => {
          setTranscript(speechResult.transcript);
          setConfidence(speechResult.confidence);
        }, 1500); // adjust as needed
      };
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback((): void => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback((): void => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback((): void => {
    setTranscript('');
    setConfidence(0);
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};