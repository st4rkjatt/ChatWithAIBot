import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    response?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, response }) => {
    if (!open) return null;
    const cleanText = (text: string) => {
        return text
            .replace(/\n{2,}/g, "\n\n")
            .replace(/([^\n])\n([^\n])/g, "$1 $2")
            .replace(/\n/g, "\n\n");
    };

    return (
        <div
            className="size-full fixed top-0 left-0 z-80 overflow-x-hidden overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center"
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
        >
            <div className="bg-white border border-gray-200 shadow-2xs rounded-xl w-full sm:max-w-lg m-3 flex flex-col pointer-events-auto">
                <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">AI</h3>
                    <button
                        type="button"
                        className="size-8 inline-flex justify-center items-center rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-3">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <p className="mb-2">{children}</p>,
                            code: ({ children }) => (
                                <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                                    <code>{children}</code>
                                </pre>
                            ),
                        }}
                    >
                        {cleanText(response)}
                    </ReactMarkdown>

                </div>
            </div>
        </div>
    );
};

export default Modal;