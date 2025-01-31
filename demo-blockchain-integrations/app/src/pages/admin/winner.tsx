"use client"

import type React from "react"
import { useState } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"
import { CreateProposalRequest } from "../../api/clientApi"
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
`

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
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

const Winner: React.FC = () => {
  const [icpPublicKey, setIcpPublicKey] = useState("")
  const [showInput, setShowInput] = useState(false)

  const handleClaimPrize = () => {
    setShowInput(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Claiming prize with ICP public key:", icpPublicKey);

    // Validate ICP public key
    if (!icpPublicKey) {
        console.error("ICP public key is required");
        return;
    }

    // Construct the proposal request for transfer
    const request: CreateProposalRequest = {
        action_type: "Transfer",
        params: {
            receiver_id: icpPublicKey, // Receiver is the input public key
            amount: "100", // Default amount is 100 ICP
        }
    };

    console.log("Sending proposal request:", request);

    try {
        const response = await new LogicApiDataSource().createProposal(request);

        if (response.error) {
            console.error("Error creating proposal:", response.error);
            return;
        }

        console.log("Proposal successfully created:", response.data?.proposal_id);
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};


  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Logo>
            <LogoImg src="/logo.png" alt="Winfinity Logo" />
            <AppName>Winfinity</AppName>
          </Logo>
        </Header>
        <MainContent>
          <Title initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Congratulations!
          </Title>
          <Message
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            You have won the lottery!
          </Message>
          <AnimatePresence>
            {!showInput ? (
              <Button
                key="claim-button"
                onClick={handleClaimPrize}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Claim Prize
              </Button>
            ) : (
              <Form
                key="claim-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Enter your ICP public key"
                  value={icpPublicKey}
                  onChange={(e) => setIcpPublicKey(e.target.value)}
                  required
                />
                <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Enter
                </Button>
              </Form>
            )}
          </AnimatePresence>
        </MainContent>
        <Footer>
          <p>&copy; {new Date().getFullYear()} Winfinity. All rights reserved.</p>
        </Footer>
      </AppContainer>
    </>
  )
}

export default Winner

