"use client"

import type React from "react"
import { useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
`

const AppName = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`

const Message = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #ecf0f1;
`

const Button = styled(motion.button)`
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

const Footer = styled.footer`
  background-color: rgba(26, 26, 46, 0.8);
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`

const Popup = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(26, 26, 46, 0.9);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-bottom: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const ChatLand: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [userName, setUserName] = useState("")
  const [error, setError] = useState<string | null>(null);

  const handleEnterChat = () => {
    setShowPopup(true)
  }

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Entered name:', userName);

    // Create the AddHostRequest object
    const request= {
      name: userName,
      
    };

    try {
      // Call addHost function
      const response = await new LogicApiDataSource().addHost(request);

      if (response.error) {
        // Handle error
        setError(response.error.message); // Assuming the error has a message field
        console.error('Error:', response.error);
      } else {
        // Handle success
        console.log('Host added successfully:', response.data);
        // Close the popup or show a success message
        setShowPopup(false);
        window.location.href='./chatroom'
      }
    } catch (err) {
      console.error('Error during addHost:', err);
      setError('Failed to add host. Please try again.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Logo>
            <LogoImg src="/logo.png" alt="Lottery Chat Logo" />
            <AppName>Lottery Chat</AppName>
          </Logo>
        </Header>
        <MainContent>
          <Title initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Welcome to Lottery Chat Room
          </Title>
          <Message
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            As a host, you have the privilege to discuss lotteries now.
          </Message>
          <Button onClick={handleEnterChat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Enter Chat
          </Button>
        </MainContent>
        <Footer>
          <p>&copy; {new Date().getFullYear()} Lottery Chat. All rights reserved.</p>
        </Footer>
      </AppContainer>
      <AnimatePresence>
        {showPopup && (
          <Popup
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmitName}>
              <Input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <Button type="submit">Enter Chat</Button>
            </form>
          </Popup>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatLand

