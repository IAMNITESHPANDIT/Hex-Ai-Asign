import React, { useEffect, useState } from "react";
import GlassCard from "../glasscard/GlassCard";
import { post } from "../../../utils/network";
import { getLocalStorageItem } from "../../../utils/localStorageUtils";
import "./chatinput.style.scss";
import Button from "../../button";

interface ChatInputProps {
  receiverId: string;
  sendMsg: (id: string, msg: string) => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({ receiverId, sendMsg }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const userId = getLocalStorageItem("userId");

  const handleSendMessage = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      _id: Date.now().toString(),
      message,
      direction: "sent",
      sender: userId,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    await sendMsg(receiverId, message);
    setMessage("");
  };

  const fetchHistory = async () => {
    try {
      const response: any = await post(
        "/api/v1/chat/interaction",
        {
          userId,
          otherUserId: receiverId,
        },
        getLocalStorageItem("access_token")
      );

      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch chat history", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const intervalId = setInterval(fetchHistory, 30000);

    return () => clearInterval(intervalId);
  }, [receiverId]);

  return (
    <GlassCard className="chat-container">
      <h3>Chat History</h3>
      <ul className="message-list">
        {messages.map((msg) => (
          <li key={msg._id} className={`message ${msg.direction}`}>
            <strong>{msg.sender === userId ? "You" : "Friend"}:</strong>
            <p>{msg.message}</p>
            <small className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </li>
        ))}
      </ul>
      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="message-input"
        />
        <Button label="Send" type="submit" onClick={() => console.log("hi")} />
      </form>
    </GlassCard>
  );
};

export default ChatInput;
