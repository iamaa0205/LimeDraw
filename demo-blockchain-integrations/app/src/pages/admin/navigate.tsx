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
, Input, TextArea, LotteryList, LotteryCard, Footer, SearchBar, SearchInput,
SearchButton, PopupOverlay, PopupContent, PopupTitle, WalletList, WalletButton, 
LotteryDetailsContainer, LotteryHeader, LotteryName, LotteryDescription, 
CreatorInfo, CreatorAvatar, CreatorAddress,CountdownContainer, 
CountdownTimer, CountdownLabel, DetailsGrid, DetailCard, DetailIcon, 
DetailLabel, DetailValue, MembersSection, MembersGrid, MemberAvatar, 
TotalMembers, BuyTicketsSection, BuyTicketsForm, TicketInput, BuyButton, 
TotalCost, HostDashboardContainer, LotteryInfo, InfoItem,  StatisticsGrid, 
StatCard, MembersList, MemberItem, NotificationWindow, fadeInUp, pageTransition, 
StatusContainer, StatusDot, StatusText} from './styles'
import {
  getJWTObject,
  getStorageAppEndpointKey,
  JsonWebToken,
} from '../../utils/storage';
import { AxiosHeader, createJwtHeader } from '../../utils/jwtHeaders';
import { getRpcPath } from '../../utils/env';


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
        console.log("dhdhdh",lottery)
      }
    } catch (error) {
      console.error("Failed to fetch lottery:", error);
    }
  };
  useEffect(()=>{
    fetchLottery()
  },[])


  useEffect(() => {
    if (currentView === "hostDashboard") {
      const fetchLottery = async () => {
        try {
          const response = await new LogicApiDataSource().getLottery();
          if (response?.data) {
           
            setLottery(response?.data)
            console.log("dhdhdh",lottery)
          }
        } catch (error) {
          console.error("Failed to fetch lottery:", error);
        }
      };
      const fetchPlayers=async ()=>{
         try {
              const response = await new LogicApiDataSource().getAllPlayers();
              console.log(response, "new ");
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
  useEffect(()=>{
    fetchLottery()

  },[])
  
  useEffect(() => {
    if (currentView === "lotteryDetails") {
     
      const fetchPlayers=async ()=>{
         try {
              const response = await new LogicApiDataSource().getAllPlayers();
              console.log(response, "new ");
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
            console.log(response, "playerrr ");

           
            if(response?.data && response?.data?.name===userName){
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
  }

  

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeInUp} transition={pageTransition}>
            <Title>Welcome to Crypto Lottery</Title>
            <Description>
              Step into the future of lotteries with Crypto Lottery. Experience the thrill of fair, transparent, and
              exciting games powered by cutting-edge blockchain technology. Your chance to win big awaits!
            </Description>
            <FeaturesList>
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
                >
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              ))}
            </FeaturesList>
            <ButtonContainer>
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsGetStartedPopupOpen(true)}
              >
                Get Started
              </Button>
            </ButtonContainer>
          </motion.div>
        )
      case "dashboard":
        return (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeInUp} transition={pageTransition}>
            <Title>Crypto Lottery Dashboard</Title>
            <Description>
              Welcome to your Crypto Lottery dashboard. Create your own lottery or join existing ones for a chance to
              win big. The power of blockchain ensures fairness and transparency in every game.
            </Description>
            <ButtonContainer>
  {lottery && lottery.name==="" ? (
    <Button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setCurrentView("createLottery");
        sessionStorage.setItem("currentView", "createLottery");
      }}
    >
      Create a Lottery
    </Button>
  ) : (
    <Button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setCurrentView("lotteryDetails");
        sessionStorage.setItem("currentView", "lotteryDetails");
      }}
    >
      Join Lottery
    </Button>
  )}
</ButtonContainer>

          </motion.div>
        )
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
          return (
            <HostDashboardContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
            
              <Title>Host Dashboard</Title>

              <Button
              style={{ marginBottom: "1rem" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateDashboard}
            >
              Update Dashboard
            </Button>


              {lottery && (
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
                <Button
              style={{ marginTop: "2rem" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const winner = players[Math.floor(Math.random() * players.length)]
                if (winner) {
                  alert(`The winner is: ${winner.name}`)
                } else {
                  alert("No players available to declare a winner")
                }
              }}
            >
              Declare Winner
            </Button>
              </HostDashboardContainer>
            )
      default:
        return null
    }
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
        <Logo onClick={() => {
              setCurrentView("dashboard");
              sessionStorage.setItem("currentView", "dashboard");
          }}>
              <img src={xyz} height="60px" width="60px" alt="Crypto Lottery Logo" />
              <AppName>Winfinity</AppName>
          </Logo>

          <div style={{ display: "flex", alignItems: "center" }}>
            {!walletConnected ? (
              <Button
                id="connect-wallet-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWalletPopupOpen(true)}
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setWalletConnected(false)
                  setCurrentView("landing")
                  sessionStorage.setItem("currentView", "landing");
                }}
              >
                Disconnect Wallet
              </Button>
            )}
            <WalletStatus connected={walletConnected} />
          </div>
        </Header>
        <MainContent>
          <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
        </MainContent>
        <Footer>
          <p>&copy; {new Date().getFullYear()} Crypto Lottery. All rights reserved.</p>
        </Footer>
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
          >
            <PopupContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <PopupTitle>Get Started</PopupTitle>
              <Form onSubmit={handleGetStartedSubmit}>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

