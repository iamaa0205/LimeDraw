'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LogicApiDataSource } from '../../api/dataSource/LogicApiDataSource';
import { CreateProposalRequest } from '../../api/clientApi';
import xyz from './logo.jpg';
import { getBalance } from '../../utils/encrypt';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #0f0f0f 0%, #1b1b1b 100%);
    color: #ffffff;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/* ======= Enhanced Navbar ======= */
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: 2px solid rgba(57, 255, 20, 0.7);
  box-shadow: 0 4px 10px rgba(57, 255, 20, 0.3);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
`;

const AppName = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(45deg, #39ff14, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.5rem;

  a {
    color: #d4ffd7;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 6px;

    &:hover {
      background: rgba(57, 255, 20, 0.2);
      box-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
    }
  }
`;

/* ======= Main Content ======= */
const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(motion.h2)`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(45deg, #39ff14, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Message = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #d4ffd7;
`;

const Button = styled(motion.button)`
  background: linear-gradient(
    45deg,
    #ffd700,
    #ffa500
  ); /* Shiny golden gradient */
  color: #000;
  border: 2px solid #daa520; /* Gold border */
  padding: 1rem 1.5rem; /* Increased padding */
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 15px rgba(255, 215, 0, 0.7); /* Initial glow effect */

  &:hover {
    transform: scale(1.05);
    box-shadow:
      0px 0px 25px rgba(255, 215, 0, 1),
      0px 0px 50px rgba(255, 165, 0, 0.8); /* Strong aura effect */
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* ======= Claim Prize Popup Form ======= */
const FormPopup = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(57, 255, 20, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 90%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #39ff14;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

/* ======= Footer ======= */
const Footer = styled.footer`
  background-color: rgba(10, 10, 10, 0.8);
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

/* ======= Component Logic ======= */
const Winner: React.FC = () => {
  const [icpPublicKey, setIcpPublicKey] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [amount,setAmount]=useState(0);
  useEffect(() => {
    const fetchBal = async () => {
      try {
        const res = await getBalance();
        setAmount(res.amount);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
  
    fetchBal();
  }, []);
  
  

  const handleClaimPrize = () => setShowInput(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!icpPublicKey) {
      console.error('ICP public key is required');
      return;
    }

    const request: CreateProposalRequest = {
      action_type: 'Transfer',
      params: {
        receiver_id: icpPublicKey,
        amount: (amount * 0.8).toString(), 
      },
    };
    

    try {
      const response = await new LogicApiDataSource().createProposal(request);
      console.log('Proposal successfully created:', response.data?.proposal_id);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Logo>
            <LogoImg src={xyz} alt="Winfinity Logo" />
            <AppName>LimeDraw</AppName>
          </Logo>
          <Button
            onClick={() => {
              window.location.href = './navigate';
            }}
            style={{
              background: 'linear-gradient(45deg, #00FF00, #32CD32, #39FF14)', // Different shades of green
              color: '#000', // Dark text for contrast
              padding: '12px 24px', // Balanced padding
              borderRadius: '10px', // Rounded edges
              border: '2px solid #00FF00', // Bright green border
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)', // Green glow effect
              transition: '0.3s ease-in-out',
              display: 'inline-block',
              textAlign: 'center',
            }}
            onMouseEnter={
              (e) =>
                (e.currentTarget.style.boxShadow =
                  '0px 0px 25px rgba(0, 255, 0, 1)') // Stronger glow on hover
            }
            onMouseLeave={
              (e) =>
                (e.currentTarget.style.boxShadow =
                  '0px 0px 15px rgba(0, 255, 0, 0.8)') // Subtle glow when idle
            }
          >
            Dashboard
          </Button>
        </Header>

        <MainContent>
          <Title>🎉 Congratulations! 🎉</Title>
          <Message>You have won the lottery!</Message>
          <Button onClick={handleClaimPrize}>Claim Prize</Button>
        </MainContent>

        <AnimatePresence>
          {showInput && (
            <FormPopup>
              <h3>Enter Your ICP Public Key</h3>
              <Input
                type="text"
                placeholder="Public Key"
                value={icpPublicKey}
                onChange={(e) => setIcpPublicKey(e.target.value)}
                required
              />
              <Button onClick={handleSubmit}>Submit</Button>
            </FormPopup>
          )}
        </AnimatePresence>

        <Footer>
          &copy; {new Date().getFullYear()} Winfinity. All rights reserved.
        </Footer>
      </AppContainer>
    </>
  );
};

export default Winner;
