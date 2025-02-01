"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import styled, { createGlobalStyle, keyframes, css } from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, Clock, Ticket, DollarSign, Users } from "lucide-react"
import { LogicApiDataSource } from "../../api/dataSource/LogicApiDataSource"
import xyz from "./logo.png"
import {GlobalStyle} from './styles'






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
  const [lotteryDetails, getLottery] = useState(null)
  const [players, setPlayers] = useState([])

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
              {lotteryDetails && (
                <LotteryInfo>
                  <h2>{lotteryDetails.name}</h2>
                  <p>{lotteryDetails.description}</p>
                  <InfoItem>Ticket Price: ${lotteryDetails.ticketPrice}</InfoItem>
                  <InfoItem>Total Tickets: {lotteryDetails.totalTickets}</InfoItem>
                  <InfoItem>Tickets Remaining: {lotteryDetails.remainingTickets}</InfoItem>
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

