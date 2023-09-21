import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/app/layout";
import { DotWave } from '@uiball/loaders'

async function* streamAsyncIterable(stream: any) {
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) return;
            yield value;
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second

        }
    } finally {
        reader.releaseLock();
    }
}

const PasswordProtectPage = () => {
    const router = useRouter();
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'What´s poppin?' },
    ]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleButtonClick = async () => {
        // Clear the textarea
        setText('');
        // Append the user's message and the API's response to the messages state
        setMessages(prevMessages => [
            ...prevMessages,
            { role: 'user', content: text },
            { role: 'assistant', content: '' },
        ]);
        try {
            const response = await fetch('/api/chat/prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: text, history: messages })
            });

            const decoder = new TextDecoder("utf-8");

            const data = await response.json();
            setMessages(prevMessages => {
                prevMessages.pop();
                prevMessages.pop();
                return [
                    ...prevMessages,
                    { role: 'user', content: text },
                    { role: 'assistant', content: data }
                ];
            });

        } catch (error) {
            setMessages(prevMessages => {
                return [
                    ...prevMessages,
                    { role: 'assistant', content: 'Something failed' }
                ];
            });
        }
    };

    return (
        <Layout>
            <div className="flex flex-col h-full">

                {/* Chat Area */}
                <div className="overflow-y-auto flex-grow p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat flex ${message.role == 'assistant' ? 'justify-start chat-start' : 'justify-end chat-end'}`}
                        >
                            <div
                                className={`chat-bubble ${message.role == 'assistant' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} p-3 rounded-lg shadow-md max-w-[70%]`}
                            >
                                {message.content == '' ? <DotWave size={35} color="#EEEEEE" /> : ''}
                                
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Textfield & Button Area */}
                <div className="flex items-center justify-between p-4 border-t border-gray-300 bg-white">
                    <textarea
                        className="textarea textarea-primary flex-grow mx-2"
                        placeholder="Ask something"
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();  // Prevent newline in textarea
                                handleButtonClick();  // Send the message
                            }
                        }}
                    ></textarea>

                    <button onClick={handleButtonClick} className="btn btn-primary ml-4">Send</button>
                </div>
            </div>
        </Layout>


    );
};

export default PasswordProtectPage;
