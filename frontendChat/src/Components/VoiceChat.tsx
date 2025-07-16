// VoiceChat.tsx
import React, { useEffect, useState } from 'react';
import { useVoiceRecognition } from '../Hook/useVoiceRecognition';
import { useSocket } from '../socket/Socket';
import { AppDispatch } from '../reduxToolkit/Store';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../reduxToolkit/Reducers/Auth.tsx/UsersSlice';
import Modal from './Modal';

interface VoiceChatProps {
    allUsers: Map<string, string>;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ allUsers }) => {
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        isSupported,
    } = useVoiceRecognition();
    const socket = useSocket()
    const dispatch: AppDispatch = useDispatch();
    const userDetails: any = localStorage.getItem('user');
    const userId = JSON.parse(userDetails)?.user?._id || JSON.parse(userDetails)?._id;
    const [status, setStatus] = useState('Say "Tony" to activate');
    const [modal, setModal] = useState(false)
    const [modalData, setModalData] = useState("")
    useEffect(() => {
        if (transcript) {
            console.log(transcript, 'transcript')
            handleCommand(transcript)
        }
    }, [transcript])

    const handleCommand = async (command: string) => {
        setStatus('Thinking...');
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/ai/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: command }),
            });

            const data = await res.json();
            let finalResult
            console.log(data.result, 'data.result')
            console.log(JSON.parse(data.result), 'data.result2')

            if (typeof data.result === "string") {
                finalResult = JSON.parse(data.result)
            }

            let speakData: string = "Please ask again.";

            switch (finalResult.intent) {
                case "chat":
                    speakData = finalResult.response
                    handleModalOpen()
                    setModalData(speakData)
                    break;

                case "close_modal":
                    speakData = finalResult.response
                    handleModalClose()
                    break

                case "send_message":
                    speakData = sendMessageCase(finalResult, allUsers, userId, socket, dispatch)
                    break;
                case "check_message":
                    const res = await checkMessageCase(finalResult, allUsers)
                    console.log(res, 'res')
                    handleCommand(res)

                    handleModalOpen()
                    setModalData(speakData)

                    return

                default:
                    break

            }

            setStatus(`GPT: ${finalResult.response}`);
            speak(speakData);

        } catch (err) {
            console.error('Error calling GPT:', err);
            setStatus('Error getting response.');
        }
    };




    const speak = async (text: string) => {
        const synth = window.speechSynthesis;
        console.log(text, '???')
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

    const handleModalClose = () => {
        setModal(false)
    }
    const handleModalOpen = () => {
        setModal(true)
    }
     
    return (
        <div className={`absolute z-10 ${isListening ? "w-full" : "w-[45%]"}  right-0`}>
            <Modal open={modal} onClose={handleModalClose} response={modalData} />
            <button onClick={() => handleCommand("close the modal")}>send</button>
            <div className="flex items-center  bg-white rounded-lg pl-4 cursor-text">
                {/* <label className="pr-1 cursor-pointer">
                    <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 text-gray-500 fill-current">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                </label> */}
                <input
                    type="text"
                    name="text"
                    id="input"
                    placeholder="Say something..."
                    className="w-full h-20 outline-none text-sm caret-orange-600 placeholder-gray-500"
                    value={status}
                />

                {transcript && <label className="px-3 cursor-pointer" onClick={resetTranscript}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600 fill-current">
                        <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.88 4.89a1 1 0 0 0 1.42-1.41L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" />
                    </svg>
                </label>}


                <div className="h-[40%] w-[1.3px] bg-gray-200"></div>
                {isSupported ? (isListening ? <div className="flex items-center space-x-2">
                    <button onClick={isListening ? stopListening : startListening} id="micBtn" className="p-3 rounded-full transition relative mic-idle bg-red-50 hover:bg-red-100">
                        <svg id="micIcon" viewBox="0 0 384 512" className="w-5 h-5 text-red-500 fill-current">
                            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
                        </svg>

                        {/* Glowing animation circle */}
                        <span
                            id="pulse"
                            className={`absolute inset-0 rounded-full bg-red-300 opacity-40 animate-ping ${isListening ? '' : 'hidden'
                                }`}
                        ></span></button>
                </div>
                    : <button
                        className="pl-3 pr-3 h-10 rounded-full hover:bg-red-100 transition duration-300 ease-in-out"
                        onClick={isListening ? stopListening : startListening}
                    >
                        <svg viewBox="0 0 384 512" className="w-3 text-orange-600 fill-current">
                            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
                        </svg>
                    </button>) : <span style={{ color: '#d32f2f', fontWeight: 500 }}>
                    Voice recognition is not supported in this browser.
                </span>}

            </div>
        </div>
    );
};

export default VoiceChat;


type FinalResult = {
    intent: string;
    recipient: string;
    messages: string[];
    senderId?: string;
    recipientId?: string;
    response?: string;
    [key: string]: any;
};



const checkMessageCase = async (finalResult: FinalResult, allUsers: Map<string, string>) => {
    const recipientId = allUsers.get(finalResult.recipient.trim());
    console.log(recipientId, 'recipientId');
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["authorization"] = token;
    }
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/message/lastMessage`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            limit: finalResult.limit,
            receiverId: recipientId,
            type: finalResult.type
        }),
    });

    const data = await res.json()
    return data

}

const sendMessageCase = (finalResult: FinalResult, allUsers: Map<string, string>, userId: string, socket: any, dispatch: AppDispatch
) => {
    console.log(finalResult.recipient, 'finalResult.recipient');
    const recipientId = allUsers.get(finalResult.recipient.trim());
    console.log(recipientId, 'recipientId');

    if (finalResult.intent === "send_message" && recipientId && finalResult.messages.length > 0) {
        finalResult.senderId = userId;
        finalResult.recipientId = recipientId;
        socket.emit("send_message", finalResult);
        finalResult.messages.forEach((msg: string) => {
            dispatch(sendMessage({ message: msg, id: recipientId! }));
        });
    }
    return finalResult.response || "Please ask again."
};




