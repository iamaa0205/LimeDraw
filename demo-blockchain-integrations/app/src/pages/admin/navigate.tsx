"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import styled, { createGlobalStyle, keyframes, css } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, Clock, Ticket, DollarSign, Users } from "lucide-react"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"
import xyz from "./logo.jpg"
import { GlobalStyle, glowingEffect, pulsingEffect, AppContainer, Header, Logo, LogoImg, AppName, 
  Button, MainContent, Title, Description, FeaturesList, FeatureCard, 
  FeatureIcon, FeatureTitle, FeatureDescription, ButtonContainer, Form
, Input, TextArea, LotteryList, LotteryCard, SearchBar, SearchInput,
SearchButton, PopupOverlay, PopupContent, PopupTitle, WalletList, WalletButton, 
LotteryDetailsContainer, LotteryHeader, LotteryName, LotteryDescription, 
CreatorInfo, CreatorAvatar, CreatorAddress,CountdownContainer, 
CountdownTimer, CountdownLabel, DetailsGrid, DetailCard, DetailIcon, 
DetailLabel, DetailValue, MembersSection, MembersGrid, MemberAvatar, 
TotalMembers, BuyTicketsSection, BuyTicketsForm, TicketInput, BuyButton, 
TotalCost, HostDashboardContainer, LotteryInfo, InfoItem,  StatisticsGrid, 
StatCard, MembersList, MemberItem, NotificationWindow, fadeInUp, pageTransition, 
StatusContainer, StatusDot, StatusText} from './styles'
import TestimonialsSection from "./testimonials"
import {
  getJWTObject,
  getStorageAppEndpointKey,
  JsonWebToken,
} from '../../utils/storage';
import { AxiosHeader, createJwtHeader } from '../../utils/jwtHeaders';
import { getRpcPath } from '../../utils/env';
import Footer from "./footer"
import HowItWorksSection from "./benifits"


export function getConfigAndJwt() {
  const jwtObject: JsonWebToken | null = getJWTObject();
  const headers: AxiosHeader | null = createJwtHeader();
  if (!headers) {
    return {
      error: { message: 'Failed to create auth headers', code: 500 },
    };
  }
  if (!jwtObject) {
    return {
      error: { message: 'Failed to get JWT token', code: 500 },
    };
  }
  if (jwtObject.executor_public_key === null) {
    return {
      error: { message: 'Failed to get executor public key', code: 500 },
    };
  }
}




interface WalletStatusProps {
  connected: boolean
}

const WalletStatus: React.FC<WalletStatusProps> = ({ connected }) => {
  return (
    <StatusContainer>
      <StatusDot connected={connected} />
      <StatusText>{connected ? "Connected" : "Not Connected"}</StatusText>
    </StatusContainer>
  )
}

export default function CryptoLottery() {
  const [currentView, setCurrentView] = useState(() => {
    return sessionStorage.getItem("currentView") || "landing"; // Get from sessionStorage or set default
  });
  const [walletConnected, setWalletConnected] = useState(true)
  const [createLotteryForm, setCreateLotteryForm] = useState({
    name: "",
    description: "",
    ticketPrice: 0,
    totalTickets: 0,
    winnerAnnouncementDate: "",
    prizePool: 0,
  })
  const [lottery,setLottery]=useState<any>(null);
  const [selectedLottery, setSelectedLottery] = useState(null)
  const [countdown, setCountdown] = useState("")
  const [ticketsToBuy, setTicketsToBuy] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false)
  const [isGetStartedPopupOpen, setIsGetStartedPopupOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [calimeroPublicKey, setCalimeroPublicKey] = useState("") // Added state for Calimero Public Key
  const [lotteryDetails, getLottery] = useState(null)
  const [players, setPlayers] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const fetchLottery = async () => {
    try {
      const response = await new LogicApiDataSource().getLottery();
      if (response?.data) {
       
        setLottery(response?.data)
      
      }
    } catch (error) {
      console.error("Failed to fetch lottery:", error);
    }
  };
  useEffect(()=>{
    fetchLottery()
    fetchPlayers1()

  },[])



  const fetchPlayers1=async ()=>{
    try {
         const response = await new LogicApiDataSource().getAllPlayers();
        
         if (response?.data) {
           setPlayers(response?.data); // Assuming API returns { players: Player[] }
         }
       } catch (error) {
         console.error("Failed to fetch players:", error);
       }

 }






  useEffect(() => {
    if (currentView === "hostDashboard") {
      const fetchLottery = async () => {
        try {
          const response = await new LogicApiDataSource().getLottery();
          if (response?.data) {
           
            setLottery(response?.data)
           
          }
        } catch (error) {
          console.error("Failed to fetch lottery:", error);
        }
      };
      const fetchPlayers=async ()=>{
         try {
              const response = await new LogicApiDataSource().getAllPlayers();
             
              if (response?.data) {
                setPlayers(response?.data); // Assuming API returns { players: Player[] }
              }
            } catch (error) {
              console.error("Failed to fetch players:", error);
            }

      }
  
      fetchLottery();
      fetchPlayers();
    }
  }, [currentView]);
 
  
  useEffect(() => {
    if (currentView === "lotteryDetails") {
     
      const fetchPlayers=async ()=>{
         try {
              const response = await new LogicApiDataSource().getAllPlayers();
             
              if (response?.data) {
                setPlayers(response?.data); // Assuming API returns { players: Player[] }
              }
            } catch (error) {
              console.error("Failed to fetch players:", error);
            }

      }
  
      fetchLottery();
      fetchPlayers();
    }
    if(currentView==='dashboard'){
      fetchLottery();

    }
  }, [currentView]);

  const onButtonPress = async (el: { target: HTMLElement }) => {
    el.target.disabled = true

    try {
      const hasAllowed = await (window as any).ic.plug.requestConnect()

      if (hasAllowed) {
        console.log("Plug wallet is connected")
        setWalletConnected(true)
        // setCurrentView("dashboard")
      } else {
        console.log("Plug wallet connection was refused")
      }
    } catch (error) {
      console.error("Error connecting to Plug wallet:", error)
    } finally {
      setTimeout(() => {
        el.target.disabled = false
      }, 5000)
    }
  }
  

  const handleConnectWallet = useCallback(
    async (wallet: string) => {
      if (wallet === "Plug") {
        try {
          const el = { target: document.getElementById("connect-wallet-button") }
          await onButtonPress(el)
        } catch (error) {
          console.error("Error connecting to Plug wallet:", error)
        }
      } else {
        console.log(`Connecting ${wallet}...`)
        setWalletConnected(true)
       
      }
      setIsWalletPopupOpen(false)
    },
    [setIsWalletPopupOpen, onButtonPress],
  ) // Added dependencies to useCallback

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating lottery:", createLotteryForm);

    // Call createLottery async function
    const request = {
      name: createLotteryForm.name,
      description: createLotteryForm.description,
      ticket_price: createLotteryForm.ticketPrice,
      ticket_count: createLotteryForm.totalTickets,
      prize_pool: createLotteryForm.prizePool,
    };
    setLottery(request)

    try {
      const response = await new LogicApiDataSource().createLottery(request);

      if (response?.error) {
        console.error('Error creating lottery:', response.error);
        return;
      }

      console.log('Lottery created successfully:', response.data);
      setCurrentView("hostDashboard"); 
      sessionStorage.setItem("currentView","hostDashboard")// Set your dashboard view after success
    } catch (error) {
      console.error("Unexpected error while creating lottery:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateLotteryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleJoinLottery = (lotteryId: string) => {
   
  }

  const handleBuyTickets = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Buying ${ticketsToBuy} tickets for lottery ${selectedLottery.name}`)
    // Implement ticket purchase logic here
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchTerm)
    // Implement search logic here
  }

  const handleGetStartedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await new LogicApiDataSource().createPlayer({
        name: userName,
      });
  
      if (response.error) {
        console.error("Error creating player:", response.error);
        alert("Please enter with correct name.")
        return;
      }
  
      console.log("Player created successfully:", response);
  
      // Close the popup and navigate to the dashboard after successful player creation
      setIsGetStartedPopupOpen(false);
      if(walletConnected===false){
        alert("Please connect wallet");
      }
      else{
    
        if(lottery.name===""){
         
          setCurrentView("dashboard");
          sessionStorage.setItem("currentView","dashboard")
  

        }
        else{
          try {
            const response = await new LogicApiDataSource().getPlayerByPublicKey();
            
           
           
            if(response?.data && response?.data?.role===1){
              setCurrentView('hostDashboard');
              sessionStorage.setItem('currentView','hostDashboard');

            }
            else{
              setCurrentView("dashboard");
              sessionStorage.setItem("currentView","dashboard")
      

            }

         
          } catch (error) {
            console.error("Failed to fetch players:", error);
          }
          
  
        }
       
      }
     
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  const handleUpdateDashboard=()=>{
    fetchLottery();
    fetchPlayers1()
  }

  

  const renderView = () => {
    switch (currentView) {
      case "landing":
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeInUp}
        transition={pageTransition}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px 30px",
          background: "radial-gradient(circle, #0a0f1e, #020617)",
          color: "#00FF00",
        }}
      >
        <Title
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center",
            marginBottom: "20px",
            textShadow: "0px 0px 10px rgba(0, 255, 0, 0.8)",
          }}
        >
          Welcome to Lime Draw
        </Title>
        <Description
          style={{
            fontSize: "18px",
            maxWidth: "700px",
            textAlign: "center",
            marginBottom: "40px",
            fontStyle: "italic",
          }}
        >
          Step into the future of lotteries with Lime Draw. Experience the thrill of fair, transparent, and
          exciting games powered by cutting-edge blockchain technology. Your chance to win big awaits!
        </Description>
        <FeaturesList
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "30px",
            padding: "20px 0",
            width: "100%",
            justifyItems: "center",
          }}
        >
          {[
            { icon: "🔒", title: "Decentralized", description: "Fully transparent and trustless system" },
            { icon: "⚖️", title: "Provably Fair", description: "Verifiable randomness for all games" },
            { icon: "⚡", title: "Instant Payouts", description: "Receive winnings immediately" },
            { icon: "💸", title: "Low Fees", description: "Minimal transaction costs" },
            { icon: "🕵️", title: "Anonymous", description: "Play without revealing your identity" },
            { icon: "🌍", title: "Global Access", description: "Play from anywhere in the world" },
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              style={{
                background: "rgba(0, 255, 0, 0.1)",
                border: "2px solid #00FF00",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0, 255, 0, 0.4)",
                textAlign: "center",
                width: "100%",
                maxWidth: "280px",
              }}
            >
              <FeatureIcon
                style={{
                  fontSize: "40px",
                  marginBottom: "15px",
                  color: "#00FF00",
                  textShadow: "0px 0px 10px rgba(0, 255, 0, 0.8)",
                }}
              >
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                  color: "#00FF00",
                }}
              >
                {feature.title}
              </FeatureTitle>
              <FeatureDescription
                style={{
                  fontSize: "14px",
                  color: "#00FF00",
                  opacity: 0.8,
                  fontStyle: "italic",
                }}
              >
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesList>
        <ButtonContainer
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      console.log("Button clicked! Opening popup...");
      setIsGetStartedPopupOpen(true);
    }}
    style={{
      background: "rgba(0, 255, 0, 0.2)",
      color: "#00FF00",
      border: "2px solid #00FF00",
      padding: "15px 30px",
      fontSize: "16px",
      fontWeight: "bold",
      borderRadius: "10px",
      cursor: "pointer",
      boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
      transition: "0.3s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0px 0px 20px rgba(0, 255, 0, 1)")}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0px 0px 10px rgba(0, 255, 0, 0.7)")}
  >
    Get Started
  </Button>
        </ButtonContainer>
      </motion.div>
    );
      case "dashboard":
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            transition={pageTransition}
            style={{
              padding: "50px",
              background: "rgba(0, 0, 0, 0.85)",
              borderRadius: "20px",
              boxShadow: "0px 20px 50px rgba(0, 255, 0, 0.6)",
              backdropFilter: "blur(12px)",
              color: "#00FF00",
              maxWidth: "1400px",
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            {/* Header Section */}
            <motion.h1
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                textShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
                letterSpacing: "1.5px",
              }}
              whileHover={{ scale: 1.02 }}
            >
              🎲 Lime Draw Dashboard 🎲
            </motion.h1>
      
            <motion.p
              style={{
                fontSize: "18px",
                color: "#fff",
                opacity: 0.9,
                maxWidth: "800px",
                margin: "0 auto",
                textShadow: "0px 0px 5px rgba(255, 255, 255, 0.3)",
              }}
              whileHover={{ scale: 1.01 }}
            >
              Welcome to your Lime Draw dashboard. Create or join a lottery for a chance to **win big**. 
              Blockchain ensures **transparency and fairness** in every draw.
            </motion.p>
      
            {/* Lottery Stats Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              <motion.div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
                  minWidth: "200px",
                  textAlign: "center",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 style={{ fontSize: "18px", color: "#00FF00", textShadow: "0px 0px 10px rgba(0, 255, 0, 0.6)" }}>💰 HUB OF CRYPTO LOTTRIES</h3>
                
              </motion.div>
      
              <motion.div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
                  minWidth: "200px",
                  textAlign: "center",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 style={{ fontSize: "18px", color: "#00FF00", textShadow: "0px 0px 10px rgba(0, 255, 0, 0.6)" }}>🎟 YOU CAN NOW PURCHASE MULTIPLE TICKETS</h3>
               
              </motion.div>
      
              <motion.div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
                  minWidth: "200px",
                  textAlign: "center",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 style={{ fontSize: "18px", color: "#00FF00", textShadow: "0px 0px 10px rgba(0, 255, 0, 0.6)" }}>🏆 PLAY AND WIN BIG</h3>
              
              </motion.div>
            </div>
      
            {/* Action Buttons */}
            <div style={{ marginTop: "30px" }}>
              {lottery && lottery.name === "" ? (
                <motion.button
                  style={{
                    backgroundColor: "#00FF00",
                    color: "#000",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    padding: "14px 28px",
                    fontSize: "18px",
                    boxShadow: "0px 6px 18px rgba(0, 255, 0, 0.6)",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentView("createLottery");
                    sessionStorage.setItem("currentView", "createLottery");
                  }}
                >
                  🚀 Create a Lottery
                </motion.button>
              ) : (
                <motion.button
                  style={{
                    backgroundColor: "#00FF00",
                    color: "#000",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    padding: "14px 28px",
                    fontSize: "18px",
                    boxShadow: "0px 6px 18px rgba(0, 255, 0, 0.6)",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentView("lotteryDetails");
                    sessionStorage.setItem("currentView", "lotteryDetails");
                  }}
                >
                  🎯 Join Lottery
                </motion.button>
              )}
            </div>
          </motion.div>
        );
        
      case "createLottery":
        return (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeInUp} transition={pageTransition}>
            <Title>Create a New Lottery</Title>
            <Form onSubmit={handleCreateLottery}>
              <Input
                type="text"
                name="name"
                placeholder="Lottery Name"
                value={createLotteryForm.name}
                onChange={handleInputChange}
                required
              />
              <TextArea
                name="description"
                placeholder="Description (Optional)"
                value={createLotteryForm.description}
                onChange={handleInputChange}
              />
              <Input
                type="number"
                name="ticketPrice"
                placeholder="Ticket Price"
                value={createLotteryForm.ticketPrice}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="totalTickets"
                placeholder="Total Number of Tickets"
                value={createLotteryForm.totalTickets}
                onChange={handleInputChange}
                required
              />
              <Input
                type="datetime-local"
                name="winnerAnnouncementDate"
                placeholder="Winner Announcement Date"
                value={createLotteryForm.winnerAnnouncementDate}
                onChange={handleInputChange}
                required
              />
              <Input
                type="number"
                name="prizePool"
                placeholder="Prize Pool Amount"
                value={createLotteryForm.prizePool}
                onChange={handleInputChange}
                required
              />
              <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Create Lottery
              </Button>
            </Form>
          </motion.div>
        )
      
      case "lotteryDetails":
        return (
          <LotteryDetailsContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Title>Lottery Dashboard</Title>
              {lottery.owner && (
                <LotteryInfo>
                  <h2>{lottery.name}</h2>
                  <p>{lottery.description}</p>
                  <InfoItem>Ticket Price: ${lottery.ticket_price}</InfoItem>
                  <InfoItem>Total Tickets: {lottery.ticket_count}</InfoItem>
                  <InfoItem>Tickets Remaining: {lottery.remaining_tickets}</InfoItem>
                </LotteryInfo>
                )}
                <StatisticsGrid>
                  <StatCard>
                    <h3>Total Members</h3>
                    <p>{players.length}</p>
                  </StatCard>
                </StatisticsGrid>
                <h3>Members</h3>
                <MembersList>
                  {players.map((player, index) => (
                    <MemberItem key={index}>{player.name}</MemberItem>
                  ))}
                </MembersList>

            <BuyTicketsSection>
              <h2>Buy Tickets</h2>
              <BuyTicketsForm onSubmit={handleBuyTickets}>
                <TicketInput
                  type="number"
                  min="1"
                  value={ticketsToBuy}
                  onChange={(e) => setTicketsToBuy(Number(e.target.value))}
                  placeholder="Number of tickets"
                />
                <BuyButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Buy Tickets
                </BuyButton>
              </BuyTicketsForm>
              {lottery && (<TotalCost>Total Cost: ${(Number(lottery.ticketPrice) * ticketsToBuy).toFixed(2)}</TotalCost> )}
            </BuyTicketsSection>
          </LotteryDetailsContainer>
        )
        case "hostDashboard":
          return(
            <HostDashboardContainer
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.7 }}
  style={{
    padding: "50px",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    borderRadius: "20px",
    boxShadow: "0px 20px 50px rgba(0, 255, 0, 0.6)",
    backdropFilter: "blur(12px)",
    color: "#00FF00",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
    overflow: "hidden",
  }}
>
  <Title
    style={{
      fontSize: "36px",
      fontWeight: "bold",
      color: "#00FF00",
      textShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
      letterSpacing: "1.5px",
      textAlign: "center",
      marginBottom: "40px",
    }}
  >
    Host Dashboard
  </Title>

  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
    <Button
      style={{
        backgroundColor: "transparent",
        color: "#00FF00",
        border: "2px solid #00FF00",
        borderRadius: "12px",
        fontWeight: "bold",
        padding: "14px 28px",
        boxShadow: "0px 6px 18px rgba(0, 255, 0, 0.6)",
        transition: "0.3s",
        flex: "1",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleUpdateDashboard}
    >
      Update Dashboard
    </Button>
    <Button
      style={{
        backgroundColor: "transparent",
        color: "#00FF00",
        border: "2px solid #00FF00",
        borderRadius: "12px",
        fontWeight: "bold",
        padding: "14px 28px",
        boxShadow: "0px 6px 18px rgba(0, 255, 0, 0.6)",
        transition: "0.3s",
        flex: "1",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const winner = players[Math.floor(Math.random() * players.length)];
        if (winner) {
          alert(`The winner is: ${winner.name}`);
        } else {
          alert("No players available to declare a winner");
        }
      }}
    >
      Declare Winner
    </Button>
  </div>

  {lottery && (
    <LotteryInfo
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
        transition: "all 0.3s ease",
      }}
    >
      <h2
        style={{
          color: "#00FF00",
          textShadow: "0px 0px 10px rgba(0, 255, 0, 0.6)",
          marginBottom: "10px",
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        {lottery.name}
      </h2>
      <p style={{ color: "#fff", fontSize: "16px", textAlign: "center", marginBottom: "10px" }}>
        {lottery.description}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <InfoItem
          style={{
            fontSize: "18px",
            color: "#00FF00",
            textAlign: "center",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          Ticket Price: ${lottery.ticket_price}
        </InfoItem>
        <InfoItem
          style={{
            fontSize: "18px",
            color: "#00FF00",
            textAlign: "center",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          Total Tickets: {lottery.ticket_count}
        </InfoItem>
        <InfoItem
          style={{
            fontSize: "18px",
            color: "#00FF00",
            textAlign: "center",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          Tickets Remaining: {lottery.remaining_tickets}
        </InfoItem>
      </div>
    </LotteryInfo>
  )}

  <StatisticsGrid
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      justifyItems: "center",
    }}
  >
    <StatCard
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
        transition: "transform 0.3s ease-in-out",
        alignSelf:"center"
      }}
    >
      <h3 style={{ color: "#00FF00", textAlign: "center", fontSize: "20px" }}>Total Members</h3>
      <p
        style={{
          color: "#fff",
          fontSize: "30px",
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out",
          fontWeight: "bold",
        }}
      >
        {players.length}
      </p>
    </StatCard>
  </StatisticsGrid>

  <h3
    style={{
      fontSize: "24px",
      color: "#00FF00",
      textAlign: "center",
      letterSpacing: "1.2px",
      marginTop: "3rem",
      textShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
    }}
  >
    Members
  </h3>

  <MembersList
    style={{
      listStyle: "none",
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginTop: "10px",
      animation: "fadeIn 0.8s ease-in-out",
    }}
  >
    {players.map((player, index) => (
      <MemberItem
        key={index}
        style={{
          backgroundColor: "rgba(0, 255, 0, 0.1)",
          padding: "10px",
          borderRadius: "8px",
          color: "#00FF00",
          fontSize: "16px",
          textAlign: "center",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 255, 0, 0.2)",
            transform: "scale(1.03)",
          },
        }}
      >
        {player.name}
      </MemberItem>
    ))}
  </MembersList>

  {/* Host Roles Section */}
  <div
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
      marginTop: "40px",
      textAlign: "center",
    }}
  >
    <h3
      style={{
        fontSize: "24px",
        color: "#00FF00",
        textAlign: "center",
        marginBottom: "15px",
        textShadow: "0px 0px 10px rgba(0, 255, 0, 0.8)",
      }}
    >
      Host Roles
    </h3>
    <p
      style={{
        color: "#fff",
        fontSize: "16px",
        textAlign: "center",
        marginBottom: "10px",
      }}
    >
      1. **Manage Lottery Details**: Ensure lottery information is accurate and updated.
    </p>
    <p
      style={{
        color: "#fff",
        fontSize: "16px",
        textAlign: "center",
        marginBottom: "10px",
      }}
    >
      2. **Declare Winners**: Randomly select winners when the lottery is complete.
    </p>
  </div>
</HostDashboardContainer>

            
          )
         
    }
  }
          
          

  return (
    <>
      <GlobalStyle />
      <AppContainer>
      <header
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "linear-gradient(135deg, #003300, #006600)",
    color: "#00FF00",
    borderBottom: "3px solid #00FF00",
    boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
    borderRadius: "0 0 20px 20px",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Glowing Border Effect */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "3px",
      background: "linear-gradient(90deg, transparent, #00FF00, transparent)",
      animation: "glowMove 2s linear infinite",
    }}
  ></div>

  {/* Logo & App Name */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      gap: "15px",
      transition: "0.3s",
    }}
    onClick={() => {
      setCurrentView("dashboard");
      sessionStorage.setItem("currentView", "dashboard");
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.transform = "scale(1.05)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = "scale(1)")
    }
  >
    <img
      src={xyz}
      height="60px"
      width="60px"
      alt="Lime Draw Logo"
      style={{
        filter: "drop-shadow(0px 0px 10px rgba(0, 255, 0, 0.8))",
        transition: "0.3s",
      }}
    />
    <span
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        textShadow: "0px 0px 10px rgba(0, 255, 0, 0.8)",
      }}
    >
      Lime Draw
    </span>
  </div>

  {/* Wallet Buttons & Status */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    {!walletConnected ? (
      <button
        style={{
          background: "rgba(0, 255, 0, 0.2)",
          color: "#00FF00",
          border: "2px solid #00FF00",
          padding: "10px 18px",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 0px 20px rgba(0, 255, 0, 1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 0px 10px rgba(0, 255, 0, 0.7)")
        }
        onClick={() => setIsWalletPopupOpen(true)}
      >
        Connect Wallet
      </button>
    ) : (
      <button
        style={{
          background: "rgba(0, 255, 0, 0.2)",
          color: "#00FF00",
          border: "2px solid #00FF00",
          padding: "10px 18px",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 0px 20px rgba(0, 255, 0, 1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow =
            "0px 0px 10px rgba(0, 255, 0, 0.7)")
        }
        onClick={() => {
          setWalletConnected(false);
          setCurrentView("landing");
          sessionStorage.setItem("currentView", "landing");
        }}
      >
        Disconnect Wallet
      </button>
    )}
    <WalletStatus connected={walletConnected} />
  </div>

  {/* CSS Animations */}
  <style>
    {`
      @keyframes glowMove {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}
  </style>
</header>
<motion.div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // Ensures it extends dynamically
    padding: "20px",
    position: "relative",
    background: "radial-gradient(circle, #0a0f1e, #020617)", // Retains the dark center background
    borderLeft: "3px solid #00FF00", // Green border on the left
    borderRight: "3px solid #00FF00", // Green border on the right
    overflowY: "auto", // Enables scrolling when content is too long
    width: "100%", // Takes full width
  }}
>
  {/* ✨ Animated Neon Grid Background */}
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      background: "url('https://www.transparenttextures.com/patterns/graph-paper.png')",
      opacity: "0.08",
      animation: "gridMove 10s linear infinite",
    }}
  ></div>

  {/* 🔥 Pulsing Neon Border Effect */}
  <div
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      border: "2px solid rgba(0, 255, 0, 0.5)", // Match header border color with slight adjustment
      boxShadow: "0 0 20px rgba(0, 255, 0, 0.8)",
      animation: "pulse 2s infinite alternate",
    }}
  ></div>

  {/* 🏆 Content Directly Inside Outer Container */}
  <AnimatePresence mode="wait">{renderView()}</AnimatePresence>

  {/* ✨ Animations & Hidden Scrollbar */}
  <style>
    {`
      @keyframes gridMove {
        0% { background-position: 0px 0px; }
        100% { background-position: 100px 100px; }
      }

      @keyframes pulse {
        0% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.4); }
        100% { box-shadow: 0 0 30px rgba(0, 255, 0, 1); }
      }

      /* Custom Scrollbar for Webkit Browsers */
      ::-webkit-scrollbar {
        width: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 0, 0.5);
        border-radius: 10px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }
    `}
  </style>
</motion.div>

<HowItWorksSection></HowItWorksSection>
<TestimonialsSection></TestimonialsSection>
   
     
<Footer></Footer>

        {isWalletPopupOpen && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWalletPopupOpen(false)}
          >
            <PopupContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <PopupTitle>Connect Your Wallet</PopupTitle>
              <WalletList>
                {["Plug"].map((wallet) => (
                  <WalletButton
                    key={wallet}
                    onClick={() => handleConnectWallet(wallet)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {wallet}
                  </WalletButton>
                ))}
              </WalletList>
            </PopupContent>
          </PopupOverlay>
        )}
        {isGetStartedPopupOpen && (
          <PopupOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGetStartedPopupOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 0.3s ease',
          }}
        >
          <PopupContent
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '30px 50px',
              borderRadius: '20px',
              boxShadow: '0px 15px 50px rgba(0, 255, 0, 0.6)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <PopupTitle
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#00FF00',
                textShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)',
                marginBottom: '20px',
                letterSpacing: '1.5px',
              }}
            >
              Get Started
            </PopupTitle>
            <Form
              onSubmit={handleGetStartedSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <Input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                style={{
                  padding: '10px 15px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  border: '2px solid #00FF00',
                  background: 'transparent',
                  color: '#00FF00',
                  outline: 'none',
                  boxShadow: '0px 4px 10px rgba(0, 255, 0, 0.5)',
                  transition: '0.3s',
                }}
              />
              <Button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#00FF00',
                  border: '2px solid #00FF00',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.6)',
                  transition: '0.3s',
                }}
              >
                Submit
              </Button>
            </Form>
          </PopupContent>
        </PopupOverlay>
        
        )}
      </AppContainer>
    </>
  )
}

