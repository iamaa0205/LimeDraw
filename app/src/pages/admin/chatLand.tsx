"use client"

import type React from "react"
import { useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"
import xyz from "./logo.jpg"

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #0a0a0a, #1a1a1a, #141414);
    color: #00ff99;
  }
`

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

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
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const LogoImg = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 1rem;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 255, 153, 0.5);
`

const AppName = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(45deg, #00ff99, #39ff14);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 153, 0.8);
`

const MainContent = styled.main`
  max-width: 1000px;
  padding: 3rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #00ff99, #39ff14);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 4px 4px 6px rgba(0, 255, 153, 0.5);
`

const Message = styled(motion.p)`
  font-size: 1.6rem;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #e0e0e0;
  text-shadow: 2px 2px 5px rgba(0, 255, 153, 0.3);
`

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #00ff99, #39ff14);
  color: #ffffff;
  font-size: 1.2rem;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 15px rgba(0, 255, 153, 0.4);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 7px 20px rgba(0, 255, 153, 0.6);
  }
`

const Footer = styled.footer`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
`

const Popup = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.95);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0px 5px 20px rgba(0, 255, 153, 0.5);
  z-index: 1000;
`

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: rgba(0, 255, 153, 0.1);
  color: #ffffff;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 255, 153, 0.3);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 255, 153, 0.8);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
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

    const request= { name: userName };

    try {
      const response = await new LogicApiDataSource().addHost(request);
      if (response.error) {
        alert("Please enter a correct username");
      } else {
        console.log('Host added successfully:', response.data);
        setShowPopup(false);
        window.location.href='./chatroom';
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
            <LogoImg src={xyz} alt="Lottery Chat Logo" />
            <AppName>Crypto Chat</AppName>
          </Logo>
        </Header>
        <MainContent>
          <Title>Welcome to the Crypto Chat</Title>
          <Message>As a host, you have the privilege to discuss crypto and lotteries anonymously.</Message>
          <Button onClick={handleEnterChat}>Enter Chat</Button>
        </MainContent>
        <Footer>
          <p>&copy; {new Date().getFullYear()} Crypto Chat. All rights reserved.</p>
        </Footer>
      </AppContainer>
      <AnimatePresence>
        {showPopup && (
          <Popup>
            <form onSubmit={handleSubmitName}>
              <Input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
              <Button type="submit">Enter Chat</Button>
            </form>
          </Popup>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatLand
