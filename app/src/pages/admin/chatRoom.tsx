'use client';
import xyz from './logo.jpg';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
// import { LogicApiDataSource } from "../api/dataSource/LogicApiDataSource"
// import { CreateMessageRoomRequest } from "../api/clientApi"
import { LogicApiDataSource } from '../../api/dataSource/LogicApiDataSource';
import { CreateMessageRoomResponse } from '../../api/clientApi';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 255, 153, 0.5);
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 3rem;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 255, 153, 0.2);
`;

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background-color: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const UpdateButton = styled(motion.button)`
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.4);

  &:hover {
    opacity: 0.9;
  }
`;

const ChatHeader = styled.div`
  background-color: rgba(46, 204, 113, 0.8);
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageItem = styled(motion.div)`
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: 10px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
`;

const MessageSender = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  color: #2ecc71;
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const MessageContent = styled.p`
  margin: 0.5rem 0 0;
`;

const InputArea = styled.form`
  display: flex;
  padding: 1rem;
  background-color: rgba(26, 26, 46, 0.9);
`;
const AppName = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(45deg, #00ff99, #39ff14);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 153, 0.8);
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #2ecc71;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-right: 0.5rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.4);

  &:hover {
    opacity: 0.9;
  }
`;

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const fetchMessages = async () => {
    try {
      const response = await new LogicApiDataSource().getAllMessageRooms();
      if (response.error) {
        console.error('Error fetching messages:', response.error);
      } else {
        console.log(response, 'messages');
        const fetchedMessages = response.data;
        setMessages(fetchedMessages);
      }
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
    }
  };

  // Fetch messages from API
  useEffect(() => {
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
      const request = {
        id: `${Date.now()}`,
        name: sessionStorage.getItem('name') || 'admin',

        text: newMessage.trim(),
      };

      try {
        const response = await new LogicApiDataSource().addMessage(request);

        if (response.error) {
          console.error('Error sending message:', response.error);
        } else {
          console.log('Message sent successfully:', response.data);

          // Add new message to the UI
          const newMsg = {
            id: request.id,
            name: sessionStorage.getItem('name'),
            text: request.text,
          };

          setMessages((prevMessages) => [...prevMessages, newMsg]);
          setNewMessage(''); // Clear input
        }
      } catch (err) {
        console.error('Unexpected error sending message:', err);
      }
    }
  };

  // Handle Update button click
  const handleUpdate = () => {
    fetchMessages();
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <Logo>
          <LogoImg src={xyz} alt="Lottery Chat Logo" />
          <AppName>LimeDraw</AppName>
        </Logo>
      </Header>

      <ChatContainer>
        <UpdateButton
          onClick={handleUpdate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update
        </UpdateButton>
        <ChatHeader>Lottery Chat Room</ChatHeader>
        <MessageList ref={messageListRef}>
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageSender>{msg.name}</MessageSender>

              <MessageContent>{msg.text}</MessageContent>
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
          <SendButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </SendButton>
        </InputArea>
      </ChatContainer>
    </>
  );
};

export default ChatRoom;
