"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import styled, { createGlobalStyle, keyframes, css } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, Clock, Ticket, DollarSign, Users } from "lucide-react"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"
import xyz from "./logo.png"
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`

const glowingEffect = keyframes`
  0% { box-shadow: 0 0 5px #4a90e2, 0 0 10px #4a90e2, 0 0 15px #4a90e2, 0 0 20px #4a90e2; }
  50% { box-shadow: 0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 30px #4a90e2, 0 0 40px #4a90e2; }
  100% { box-shadow: 0 0 5px #4a90e2, 0 0 10px #4a90e2, 0 0 15px #4a90e2, 0 0 20px #4a90e2; }
`

const pulsingEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
    animation: ${glowingEffect} 1.5s infinite;
  }
`

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex-grow: 1;
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

const Description = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-align: center;
  color: #ecf0f1;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`

const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #cccccc;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
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

const TextArea = styled.textarea`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const LotteryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`

const LotteryCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`

const Footer = styled.footer`
  background-color: rgba(26, 26, 46, 0.8);
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const SearchInput = styled(Input)`
  flex-grow: 1;
`

const SearchButton = styled(Button)`
  margin-left: 0.5rem;
`

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const PopupContent = styled(motion.div)`
  background-color: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
`

const PopupTitle = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
`

const WalletList = styled.div`
  display: grid;
  gap: 1rem;
`

const WalletButton = styled(motion.button)`
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }
`

const LotteryDetailsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const LotteryHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`

const LotteryName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`

const LotteryDescription = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #a0aec0;
`

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`

const CreatorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`

const CreatorAddress = styled.span`
  font-size: 0.9rem;
  color: #a0aec0;
`

const CountdownContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const CountdownTimer = styled.div<{ urgent: boolean }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a90e2;
  ${(props) =>
    props.urgent &&
    css`
      animation: ${pulsingEffect} 1.5s infinite;
    `}
`

const CountdownLabel = styled.div`
  font-size: 1rem;
  color: #a0aec0;
  margin-top: 0.5rem;
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const DetailCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const DetailIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4a90e2;
`

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
`

const DetailValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
`

const MembersSection = styled.section`
  margin-bottom: 2rem;
`

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 1rem;
`

const MemberAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TotalMembers = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #a0aec0;
`

const BuyTicketsSection = styled.section`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
`

const BuyTicketsForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TicketInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }
`

const BuyButton = styled(motion.button)`
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: ${glowingEffect} 1.5s infinite;
  }
`

const TotalCost = styled.div`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #a0aec0;
`

const HostDashboardContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const LotteryInfo = styled.div`
  margin-bottom: 2rem;
`

const InfoItem = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`

const StatCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
`

const MembersList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const MemberItem = styled.li`
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
`

const NotificationWindow = styled.div`
  height: 200px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  margin-top: 2rem;
`

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

// WalletStatus component
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`

const StatusDot = styled.div<{ connected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.connected ? "#4CAF50" : "#FF5722")};
  margin-right: 0.5rem;
`

const StatusText = styled.span`
  font-size: 0.9rem;
  color: #ffffff;
`

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
  const [currentView, setCurrentView] = useState("landing")
  const [walletConnected, setWalletConnected] = useState(false)
  const [createLotteryForm, setCreateLotteryForm] = useState({
    name: "",
    description: "",
    ticketPrice: 0,
    totalTickets: 0,
    winnerAnnouncementDate: "",
    prizePool: 0,
  })
  const [existingLotteries, setExistingLotteries] = useState([
    {
      id: "1",
      name: "Mega Millions",
      description: "Win big with Mega Millions!",
      ticketPrice: "5",
      owner: "0x1234...5678",
      prizePool: "1000000",
      remainingTickets: "1000",
    },
    {
      id: "2",
      name: "PowerBall",
      description: "The power is in your hands!",
      ticketPrice: "3",
      owner: "0xabcd...efgh",
      prizePool: "500000",
      remainingTickets: "500",
    },
    {
      id: "3",
      name: "EuroJackpot",
      description: "Europe's favorite lottery",
      ticketPrice: "4",
      owner: "0x9876...5432",
      prizePool: "750000",
      remainingTickets: "750",
    },
  ])
  const [selectedLottery, setSelectedLottery] = useState(null)
  const [countdown, setCountdown] = useState("")
  const [ticketsToBuy, setTicketsToBuy] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false)
  const [isGetStartedPopupOpen, setIsGetStartedPopupOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [calimeroPublicKey, setCalimeroPublicKey] = useState("") // Added state for Calimero Public Key

  useEffect(() => {
    if (currentView === "lotteryDetails" && selectedLottery) {
      const interval = setInterval(() => {
        const now = new Date().getTime()
        const endTime = new Date(selectedLottery.winnerAnnouncementDate).getTime()
        const timeLeft = endTime - now

        if (timeLeft < 0) {
          clearInterval(interval)
          setCountdown("Winner Announced!")
        } else {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentView, selectedLottery])

  useEffect(() => {
    if (currentView === "hostDashboard") {
      const interval = setInterval(() => {
        const newNotification = {
          message: `User 0x${Math.random().toString(16).substr(2, 8)} purchased ${Math.floor(Math.random() * 10) + 1} tickets`,
          timestamp: new Date().toLocaleTimeString(),
        }
        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)])
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [currentView])

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

    try {
      const response = await new LogicApiDataSource().createLottery(request);

      if (response?.error) {
        console.error('Error creating lottery:', response.error);
        return;
      }

      console.log('Lottery created successfully:', response.data);
      setCurrentView("hostDashboard"); // Set your dashboard view after success
    } catch (error) {
      console.error("Unexpected error while creating lottery:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateLotteryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleJoinLottery = (lotteryId: string) => {
    const lottery = existingLotteries.find((l) => l.id === lotteryId)
    setSelectedLottery(lottery)
    setCurrentView("lotteryDetails")
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
        setCurrentView("dashboard");

      }
     
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  

  const filteredLotteries = existingLotteries.filter(
    (lottery) =>
      lottery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lottery.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView("createLottery")}
              >
                Create a Lottery
              </Button>
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView("joinLottery")}
              >
                Join an Existing Lottery
              </Button>
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
      case "joinLottery":
        return (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeInUp} transition={pageTransition}>
            <Title>Join an Exciting Lottery</Title>
            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Search lotteries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton onClick={handleSearch}>
                <Search size={20} />
              </SearchButton>
            </SearchBar>
            <LotteryList>fz
              {filteredLotteries.map((lottery, index) => (
                <LotteryCard
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{lottery.name}</h3>
                    <p style={{ fontSize: "1rem", color: "#cccccc", marginBottom: "1rem" }}>{lottery.description}</p>
                    <p style={{ fontSize: "1.2rem", color: "#4a90e2" }}>Ticket Price: ${lottery.ticketPrice}</p>
                    <p>Owner: {lottery.owner}</p>
                    <p>Remaining Tickets: {lottery.remainingTickets}</p>
                  </div>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinLottery(lottery.id)}
                    style={{ marginTop: "1rem" }}
                  >
                    Join Now
                  </Button>
                </LotteryCard>
              ))}
            </LotteryList>
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
            <LotteryHeader>
              <LotteryName>{selectedLottery.name}</LotteryName>
              <LotteryDescription>{selectedLottery.description}</LotteryDescription>
              <CreatorInfo>
                <CreatorAvatar>
                  <User size={24} />
                </CreatorAvatar>{" "}
                <CreatorAddress>{selectedLottery.owner}</CreatorAddress>
              </CreatorInfo>
            </LotteryHeader>

            <CountdownContainer>
              <CountdownTimer urgent={countdown.includes("h") && Number.parseInt(countdown.split("h")[0]) < 24}>
                {countdown}
              </CountdownTimer>
              <CountdownLabel>Time Remaining</CountdownLabel>
            </CountdownContainer>

            <DetailsGrid>
              <DetailCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DetailIcon>
                  <Ticket />
                </DetailIcon>
                <DetailLabel>Ticket Price</DetailLabel>
                <DetailValue>${selectedLottery.ticketPrice}</DetailValue>
              </DetailCard>
              <DetailCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DetailIcon>
                  <DollarSign />
                </DetailIcon>
                <DetailLabel>Prize Pool</DetailLabel>
                <DetailValue>${selectedLottery.prizePool}</DetailValue>
              </DetailCard>
              <DetailCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DetailIcon>
                  <Ticket />
                </DetailIcon>
                <DetailLabel>Remaining Tickets</DetailLabel>
                <DetailValue>{selectedLottery.remainingTickets}</DetailValue>
              </DetailCard>
              <DetailCard whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DetailIcon>
                  <Clock />
                </DetailIcon>
                <DetailLabel>Winner Announcement</DetailLabel>
                <DetailValue>{new Date(selectedLottery.winnerAnnouncementDate).toLocaleDateString()}</DetailValue>
              </DetailCard>
            </DetailsGrid>

            <MembersSection>
              <h2>Members</h2>
              <MembersGrid>
                {[...Array(10)].map((_, index) => (
                  <MemberAvatar key={index}>
                    <User size={24} />
                  </MemberAvatar>
                ))}
              </MembersGrid>
              <TotalMembers>
                <Users size={16} style={{ marginRight: "0.5rem" }} />
                Total Participants: 42
              </TotalMembers>
            </MembersSection>

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
              <TotalCost>Total Cost: ${(Number(selectedLottery.ticketPrice) * ticketsToBuy).toFixed(2)}</TotalCost>
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
            <LotteryInfo>
              <h2>{createLotteryForm.name}</h2>
              <p>{createLotteryForm.description}</p>
              <InfoItem>Ticket Price: ${createLotteryForm.ticketPrice}</InfoItem>
              <InfoItem>Total Tickets: {createLotteryForm.totalTickets}</InfoItem>
              <InfoItem>
                Winner Announcement Date: {new Date(createLotteryForm.winnerAnnouncementDate).toLocaleString()}
              </InfoItem>
              <InfoItem>Prize Pool: ${createLotteryForm.prizePool}</InfoItem>
            </LotteryInfo>
            <StatisticsGrid>
              <StatCard>
                <h3>Total Members</h3>
                <p>42</p>
              </StatCard>
              <StatCard>
                <h3>Entry Fees Collected</h3>
                <p>$2,100</p>
              </StatCard>
              <StatCard>
                <h3>Tickets Remaining</h3>
                <p>580</p>
              </StatCard>
            </StatisticsGrid>
            <h3>Members</h3>
            <MembersList>
              <MemberItem>User 0x9876...4321</MemberItem>
              <MemberItem>User 0xabcd...efgh</MemberItem>
              <MemberItem>User 0x1111...2222</MemberItem>
            </MembersList>
            <h3>Recent Activity</h3>
            <NotificationWindow>
              {notifications.map((notification, index) => (
                <p key={index}>
                  <strong>{notification.timestamp}</strong>: {notification.message}
                </p>
              ))}
            </NotificationWindow>
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
          <Logo onClick={() => setCurrentView("dashboard")}>
            <img src={xyz}  height="60px" width="60px" alt="Crypto Lottery Logo" />
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

