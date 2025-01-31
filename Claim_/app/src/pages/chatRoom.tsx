"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { motion } from "framer-motion"
import { LogicApiDataSource } from "../api/dataSource/LogicApiDataSource"
import { CreateMessageRoomRequest } from "../api/clientApi"

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background-color: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const ChatHeader = styled.div`
  background-color: rgba(74, 144, 226, 0.9);
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
`

const MessageItem = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
`

const MessageSender = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  color: #4a90e2;
`

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`

const MessageContent = styled.p`
  margin: 0.5rem 0 0;
`

const InputArea = styled.form`
  display: flex;
  padding: 1rem;
  background-color: rgba(26, 26, 46, 0.9);
`

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-right: 0.5rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const SendButton = styled(motion.button)`
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await new LogicApiDataSource().getAllMessageRooms();
        if (response.error) {
          console.error("Error fetching messages:", response.error);
        } else {
          const fetchedMessages: Message[] = response.data.rooms.map((room:any) => ({
            id: 1,
            sender: "System", // Adjust if you store sender info
            content: room.text,
            timestamp: new Date(), // Adjust if the API provides timestamps
          }));
          setMessages(fetchedMessages);
        }
      } catch (err) {
        console.error("Unexpected error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim()) {
      const request: CreateMessageRoomRequest = {
        id: `${Date.now()}`, // Unique ID for the message room
        text: newMessage.trim(),
      };

      try {
        const response = await new LogicApiDataSource().addMessage(request);

        if (response.error) {
          console.error("Error sending message:", response.error);
        } else {
          console.log("Message sent successfully:", response.data);
          
          // Add new message to the UI
          const newMsg: Message = {
            id: request.id,
            sender: "You",
            content: request.text,
            timestamp: new Date(),
          };

          setMessages((prevMessages) => [...prevMessages, newMsg]);
          setNewMessage(""); // Clear input
        }
      } catch (err) {
        console.error("Unexpected error sending message:", err);
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <ChatContainer>
        <ChatHeader>Lottery Chat Room</ChatHeader>
        <MessageList ref={messageListRef}>
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageSender>{msg.sender}</MessageSender>
              <MessageTime>{msg.timestamp.toLocaleTimeString()}</MessageTime>
              <MessageContent>{msg.content}</MessageContent>
            </MessageItem>
          ))}
        </MessageList>
        <InputArea onSubmit={handleSubmit}>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <SendButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Send
          </SendButton>
        </InputArea>
      </ChatContainer>
    </>
  );
};

export default ChatRoom;
