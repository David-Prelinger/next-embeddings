import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "@/app/layout";

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
        { role: 'assistant', content: 'How can I help you?' },
    ]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleButtonClick = async () => {
        try {
            const response = await fetch('/api/chat/prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: text, history: messages })
            });

            const decoder = new TextDecoder("utf-8");
            var data: string = "";
            // Append the user's message and the API's response to the messages state
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'user', content: text },
            ]);
            for await (const chunk of streamAsyncIterable(response.body)) {
                console.log(decoder.decode(chunk));
                data += decoder.decode(chunk);
                setMessages(prevMessages => { 
                    prevMessages.pop();
                    return [
                    ...prevMessages,
                    { role: 'assistant', content: data },
                ]});
            }





            // Clear the textarea
            setText('');

        } catch (error) {
            console.error("Failed to send the request:", error);
        }
    };

    return (
        <Layout>
            {messages.map((message, index) => (
                <div key={index} className={`chat chat-${message.role == 'assistant' ? 'start' : 'end'}`}>
                    <div className="chat-bubble">{message.content}</div>
                </div>
            ))}
            <textarea
                className="textarea textarea-primary"
                placeholder="Bio"
                value={text}
                onChange={handleTextChange}
            ></textarea>
            <button onClick={handleButtonClick}>Send</button>
        </Layout>
    );
};

export default PasswordProtectPage;
