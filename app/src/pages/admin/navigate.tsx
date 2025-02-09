'use client';
import { toast } from 'react-hot-toast';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Clock, Ticket, DollarSign, Users } from 'lucide-react';
import { LogicApiDataSource } from '../../api/dataSource/LogicApiDataSource';
import xyz from './logo.jpg';
import { IDL } from '@dfinity/candid';
import { buy } from '../../utils/encrypt';
import {
  GlobalStyle,
  glowingEffect,
  pulsingEffect,
  AppContainer,
  Header,
  Logo,
  LogoImg,
  AppName,
  Button,
  MainContent,
  Title,
  Description,
  FeaturesList,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  ButtonContainer,
  Form,
  Input,
  TextArea,
  LotteryList,
  LotteryCard,
  SearchBar,
  SearchInput,
  SearchButton,
  PopupOverlay,
  PopupContent,
  PopupTitle,
  WalletList,
  WalletButton,
  LotteryDetailsContainer,
  LotteryHeader,
  LotteryName,
  LotteryDescription,
  CreatorInfo,
  CreatorAvatar,
  CreatorAddress,
  CountdownContainer,
  CountdownTimer,
  CountdownLabel,
  DetailsGrid,
  DetailCard,
  DetailIcon,
  DetailLabel,
  DetailValue,
  MembersSection,
  MembersGrid,
  MemberAvatar,
  TotalMembers,
  BuyTicketsSection,
  BuyTicketsForm,
  TicketInput,
  BuyButton,
  TotalCost,
  HostDashboardContainer,
  LotteryInfo,
  InfoItem,
  StatisticsGrid,
  StatCard,
  MembersList,
  MemberItem,
  NotificationWindow,
  fadeInUp,
  pageTransition,
  StatusContainer,
  StatusDot,
  StatusText,
} from './styles';
import TestimonialsSection from './testimonials';
import {
  getJWTObject,
  getStorageAppEndpointKey,
  JsonWebToken,
} from '../../utils/storage';
import { AxiosHeader, createJwtHeader } from '../../utils/jwtHeaders';
import { getRpcPath } from '../../utils/env';
import Footer from './footer';
import HowItWorksSection from './benifits';
import {
  addLottery,
  getNoTicket,
  getAvailableNoTicket,
  setWinnerDeclared,
  getWinningTicket,
  getPubKey,
  getUniqueUsers,
  checkWinnerDeclared,
} from '../../utils/icp';
import { CreateProposalRequest } from '../../api/clientApi';
import { ProposalActionType } from '../../api/clientApi';
import { encryptData, decryptData } from '../../utils/encrypt';
import { get } from 'http';

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

  return jwtObject.executor_public_key;
}

export function getConfigAndJwtContextId() {
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
  return jwtObject.context_id;
}

interface WalletStatusProps {
  connected: boolean;
}

const WalletStatus: React.FC<WalletStatusProps> = ({ connected }) => {
  return (
    <StatusContainer>
      <StatusDot connected={connected} />
      <StatusText>{connected ? 'Connected' : 'Not Connected'}</StatusText>
    </StatusContainer>
  );
};

export default function CryptoLottery() {
  const [currentView, setCurrentView] = useState(() => {
    return sessionStorage.getItem('currentView') || 'landing'; // Get from sessionStorage or set default
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const [createLotteryForm, setCreateLotteryForm] = useState({
    name: '',
    description: '',
    ticketPrice: 0,
    totalTickets: 0,
    winnerAnnouncementDate: '',
    prizePool: 0,
  });

  useEffect(() => {
    const id = getConfigAndJwtContextId();
    if (id === import.meta.env.VITE_LOTTERY_CONTEXT_ID2) {
      window.location.href = './winner';
    }
  }, []);

  const [remTickets, setRemTickets] = useState<any>(1);

  const [lottery, setLottery] = useState<any>(null);
  const [selectedLottery, setSelectedLottery] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [ticketsToBuy, setTicketsToBuy] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [isGetStartedPopupOpen, setIsGetStartedPopupOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [calimeroPublicKey, setCalimeroPublicKey] = useState(''); // Added state for Calimero Public Key
  const [lotteryDetails, getLottery] = useState(null);
  const [players, setPlayers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [totalPlayer, setTotalPlayers] = useState(1);
  const [isWinner, setIsWinner] = useState(false);

  const testimonials = [
    {
      name: 'Dhruv Goel',
      feedback:
        "This is the most exciting lottery I've ever participated in! Fast payouts and an incredible user experience.",
      avatar: '👨‍💼',
      winAmount: '5,000 USDT',
    },
    {
      name: 'Anna L.',
      feedback:
        "I love the transparency of the blockchain! It's reassuring to know my winnings are verifiable and secure.",
      avatar: '👩‍🔬',
      winAmount: '10,000 USDT',
    },
    {
      name: 'Alex T.',
      feedback:
        'The system is intuitive and I can play from anywhere in the world. Crypto Lottery has revolutionized online gambling!',
      avatar: '🧑‍💻',
      winAmount: '7,500 USDT',
    },
    {
      name: 'Sarah M.',
      feedback:
        'As a crypto enthusiast, I appreciate the innovative approach. The smart contracts ensure fairness and instant payouts.',
      avatar: '👩‍🚀',
      winAmount: '15,000 USDT',
    },
  ];
  const fetchLottery = async () => {
    try {
      const response = await new LogicApiDataSource().getLottery();
      if (response?.data) {
        setLottery(response?.data);
        // setRemTickets(response.data.remaining_tickets);
      }
    } catch (error) {
      console.error('Failed to fetch lottery:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchLottery();
      await fetchPlayers1();
      await isWinnerDeclared(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
      await handleUniquePlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
      await handleAvailableNoOfPlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
    };

    fetchData();

    if (isWinner) {
      toast('Congratulations you are declared as winner!');
    }
  }, []);

  useEffect(() => {
    if (isWinner) {
      toast('Congratulations! You are declared as the winner!');
    }
    console.log('is w', isWinner);
  }, [isWinner]); // Runs whenever isWinner changes

  const getWinner = async (context1: any) => {
    try {
      const res = await getWinningTicket(context1);
      const num = res[0];
      let extractedNumber = num.toString(); // "842"
      return extractedNumber;

      console.log('Lottery added successfully');
    } catch (error) {
      console.error('Failed to add lottery:', error);
    }
  };

  const getWinnerPublicKey = async (context1: any, ticketId: any) => {
    try {
      const res = await getPubKey(context1, ticketId);
      return res;

      console.log('public key of winer retrieved successfully');
    } catch (error) {
      console.error('Failed to add lottery:', error);
    }
  };

  const isWinnerDeclared = async (context1: any) => {
    try {
      const res = await checkWinnerDeclared(context1);
      console.log('winner declared', typeof res[0]);
      if (res[0] == true) {
        try {
          const cpubkey = getConfigAndJwt();
          const encryptedPubKey = await encryptData(cpubkey);

          await declareWinner();

          const response = await getWinner(
            import.meta.env.VITE_LOTTERY_CONTEXT_ID,
          );
          const response2 = await getWinnerPublicKey(
            import.meta.env.VITE_LOTTERY_CONTEXT_ID,
            Number(response),
          );

          const decryptedPubKey = await decryptData(response2[0]);

          // Success toast with winner's public key
          if (decryptedPubKey === cpubkey) {
            setIsWinner(true);
          }

          console.log('Public key of winner retrieved successfully');
        } catch (error) {
          console.error('Error in handleWinner:', error);
        }
      }
      return res;
    } catch (error) {
      console.error('Failed to check winner declaration:', error);
      return false; // Ensure function always returns something
    }
  };

  const fetchPlayers1 = async () => {
    try {
      const response = await new LogicApiDataSource().getAllPlayers();

      if (response?.data) {
        setPlayers(response?.data); // Assuming API returns { players: Player[] }
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };
  const handleAddLottery = async (
    tickets: any,
    context1: any,
    context2: any,
    principal: any,
  ) => {
    try {
      await addLottery(tickets, context1, context2, principal);
      console.log('Lottery added successfully');
    } catch (error) {
      console.error('Failed to add lottery:', error);
    }
  };

  const handleUniquePlayers = async (context1: any) => {
    try {
      const uniqueUsers = await getUniqueUsers(context1);

      setTotalPlayers(Number(uniqueUsers));
    } catch (error) {
      console.error('Failed to get unique users:', error);
      return null;
    }
  };

  const handleAvailableNoOfPlayers = async (context1: any) => {
    try {
      const noOfUsers = await getAvailableNoTicket(context1);
      console.log('Available No of Tickets:', noOfUsers);
      setRemTickets(Number(noOfUsers));

      return noOfUsers;
    } catch (error) {
      console.error('Failed to get no of users:', error);
      return null;
    }
  };

  const declareWinner = async () => {
    try {
      const cpubkey = getConfigAndJwt();
      const encryptedPubKey = await encryptData(cpubkey);
      console.log(encryptedPubKey);

      try {
        const request: CreateProposalRequest = {
          action_type: ProposalActionType.ExternalFunctionCall,
          params: {
            receiver_id: import.meta.env.VITE_Backend_Canister_Contract_ID, // Replace with actual contract ID
            method_name: 'setWinnerDeclared',
            args: `${import.meta.env.VITE_LOTTERY_CONTEXT_ID}${encryptedPubKey}`,
            deposit: '0',
          },
        };

        console.log('Sending proposal request:', request);

        const response = await new LogicApiDataSource().createProposal(request);

        if (response.error) {
          console.log('Failed to create proposal. Try again later.');
        } else {
          console.log('Proposal created successfully:', response.data);
        }
      } catch (error) {
        console.error('Error in declareWinner:', error);
      }
      console.log('Winner Declared');
    } catch (error) {
      console.error('Error declaring winner');
    }
  };

  useEffect(() => {
    if (currentView === 'hostDashboard') {
      const fetchLottery = async () => {
        try {
          const response = await new LogicApiDataSource().getLottery();
          if (response?.data) {
            setLottery(response?.data);
          }
        } catch (error) {
          console.error('Failed to fetch lottery:', error);
        }
      };
      const fetchPlayers = async () => {
        try {
          const response = await new LogicApiDataSource().getAllPlayers();

          if (response?.data) {
            setPlayers(response?.data); // Assuming API returns { players: Player[] }
          }
        } catch (error) {
          console.error('Failed to fetch players:', error);
        }
      };

      fetchLottery();
      fetchPlayers();
    }
  }, [currentView]);

  const handleWinner = async () => {
    // Show loading toast
    const toastId = toast.loading('Declaring winner...');

    try {
      const cpubkey = getConfigAndJwt();
      const encryptedPubKey = await encryptData(cpubkey);

      await declareWinner();

      const response = await getWinner(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
      const response2 = await getWinnerPublicKey(
        import.meta.env.VITE_LOTTERY_CONTEXT_ID,
        Number(response),
      );

      const decryptedPubKey = await decryptData(response2[0]);

      // Success toast with winner's public key
      toast.success(`Winner declared! Public Key: ${decryptedPubKey}`, {
        id: toastId,
      });
    } catch (error) {
      console.error('Error in handleWinner:', error);

      // Error toast
      toast.error('Failed to declare winner. Please try again.', {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    if (currentView === 'lotteryDetails') {
      const fetchPlayers = async () => {
        try {
          const response = await new LogicApiDataSource().getAllPlayers();

          if (response?.data) {
            setPlayers(response?.data); // Assuming API returns { players: Player[] }
          }
        } catch (error) {
          console.error('Failed to fetch players:', error);
        }
      };

      fetchLottery();
      fetchPlayers();
    }
    if (currentView === 'dashboard') {
      fetchLottery();
    }
  }, [currentView]);

  const onButtonPress = async (el: { target: HTMLElement }) => {
    el.target.disabled = true;

    try {
      const hasAllowed = await (window as any).ic.plug.requestConnect();

      if (hasAllowed) {
        console.log('Plug wallet is connected');
        setWalletConnected(true);
        // setCurrentView("dashboard")
      } else {
        console.log('Plug wallet connection was refused');
      }
    } catch (error) {
      console.error('Error connecting to Plug wallet:', error);
    } finally {
      setTimeout(() => {
        el.target.disabled = false;
      }, 5000);
    }
  };

  const handleConnectWallet = useCallback(
    async (wallet: string) => {
      if (wallet === 'Plug') {
        try {
          const el = {
            target: document.getElementById('connect-wallet-button'),
          };

          await onButtonPress(el);
        } catch (error) {
          console.error('Error connecting to Plug wallet:', error);
        }
      } else {
        console.log(`Connecting ${wallet}...`);
        setWalletConnected(true);
      }
      setIsWalletPopupOpen(false);
    },
    [setIsWalletPopupOpen, onButtonPress],
  ); // Added dependencies to useCallback
  console.log(
    import.meta.env.VITE_LOTTERY_CONTEXT_ID,
    '1',
    import.meta.env.VITE_LOTTERY_CONTEXT_ID2,
  );

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating lottery:', createLotteryForm);
    await handleAddLottery(
      Number(createLotteryForm.totalTickets),
      import.meta.env.VITE_LOTTERY_CONTEXT_ID,
      import.meta.env.VITE_LOTTERY_CONTEXT_ID2,
      import.meta.env.VITE_PROXY_CONTRACT_ID1,
    );
    console.log('Lottery added successfully');

    // Call createLottery async function
    const request = {
      name: createLotteryForm.name,
      description: createLotteryForm.description,
      ticket_price: createLotteryForm.ticketPrice,
      ticket_count: createLotteryForm.totalTickets,
      prize_pool: 100, // Just for test purpose so that we can implement this feature in future
    };
    setLottery(request);

    try {
      const response = await new LogicApiDataSource().createLottery(request);

      if (response?.error) {
        console.error('Error creating lottery:', response.error);
        return;
      }

      console.log('Lottery created successfully:', response.data);
      setCurrentView('hostDashboard');
      sessionStorage.setItem('currentView', 'hostDashboard'); // Set your dashboard view after success
    } catch (error) {
      console.error('Unexpected error while creating lottery:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCreateLotteryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuyTickets = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpubkey = getConfigAndJwt();
    const encryptedPubKey = await encryptData(cpubkey);
    console.log(encryptedPubKey);
    await buy();

    // Show loading toast
    const toastId = toast.loading('Purchasing ticket...');

    try {
      const request: CreateProposalRequest = {
        action_type: ProposalActionType.ExternalFunctionCall,
        params: {
          receiver_id: import.meta.env.VITE_Backend_Canister_Contract_ID, // Replace with actual contract ID
          method_name: 'buyTicket',
          args: `${import.meta.env.VITE_LOTTERY_CONTEXT_ID}${encryptedPubKey}`,
          deposit: '0',
        },
      };

      console.log('Sending proposal request:', request);

      const response = await new LogicApiDataSource().createProposal(request);

      if (response.error) {
        console.log('Failed to create proposal. Try again later.');
        toast.error('Failed to create ticket purchase proposal.', {
          id: toastId,
        });
      } else {
        console.log('Proposal created successfully:', response.data);
        toast.success('Ticket purchased successfully!', { id: toastId });
      }
    } catch (error) {
      console.error('Error in handleBuyTickets:', error);
      toast.error('An error occurred while purchasing the ticket.', {
        id: toastId,
      });
    }

    try {
      // Call the API to decrement remaining tickets
      const response =
        await new LogicApiDataSource().decrementRemainingTickets();

      if (response.error) {
        console.log('Failed to decrement tickets. Try again later.');
        toast.error('Failed to update remaining tickets.');
      } else {
        console.log('Remaining tickets after decrement:');
        toast.success('Remaining tickets updated.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error while updating remaining tickets.');
    }

    await handleUniquePlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
    await handleAvailableNoOfPlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
  };

  const handleGetStartedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await new LogicApiDataSource().createPlayer({
        name: userName,
      });

      if (response.error) {
        console.error('Error creating player:', response.error);
        alert('Please enter with correct name.');
        return;
      }

      console.log('Player created successfully:', response);

      // Close the popup and navigate to the dashboard after successful player creation
      setIsGetStartedPopupOpen(false);
      if (walletConnected === false) {
        alert('Please connect wallet');
      } else {
        if (lottery.name === '') {
          setCurrentView('dashboard');
          sessionStorage.setItem('currentView', 'dashboard');
        } else {
          try {
            const response =
              await new LogicApiDataSource().getPlayerByPublicKey();

            if (response?.data && response?.data?.role === 1) {
              setCurrentView('hostDashboard');
              sessionStorage.setItem('currentView', 'hostDashboard');
            } else {
              setCurrentView('dashboard');
              sessionStorage.setItem('currentView', 'dashboard');
            }
          } catch (error) {
            console.error('Failed to fetch players:', error);
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  const handleUpdateDashboard = async () => {
    toast.loading('Updating dashboard...', { id: 'updateDashboard' });

    try {
      fetchLottery();
      fetchPlayers1();
      await handleUniquePlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);
      await handleAvailableNoOfPlayers(import.meta.env.VITE_LOTTERY_CONTEXT_ID);

      toast.success('Dashboard updated successfully!', {
        id: 'updateDashboard',
      });
    } catch (error) {
      toast.error('Failed to update dashboard. Please try again.', {
        id: 'updateDashboard',
      });
      console.error('Error updating dashboard:', error);
    }
  };
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            transition={pageTransition}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '50px 30px',
              background: 'radial-gradient(circle, #0a0f1e, #020617)',
              color: '#00FF00',
            }}
          >
            <Title
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textAlign: 'center',
                marginBottom: '20px',
                textShadow: '0px 0px 10px rgba(0, 255, 0, 0.8)',
              }}
            >
              Welcome to LimeDraw
            </Title>
            <Description
              style={{
                fontSize: '18px',
                maxWidth: '700px',
                textAlign: 'center',
                marginBottom: '40px',
                fontStyle: 'italic',
              }}
            >
              <p>
                Step into the future of lotteries with{' '}
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    color: '#00FF00', // Neon Green
                    textShadow: '0px 0px 10px rgba(0, 255, 0, 1)', // Neon glow effect
                    letterSpacing: '1px',
                  }}
                >
                  LimeDraw
                </span>
                . Experience the thrill of fair, transparent, and exciting games
                powered by cutting-edge blockchain technology. Your chance to
                win big awaits!
              </p>
            </Description>
            <ButtonContainer
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Button clicked! Opening popup...');
                  setIsGetStartedPopupOpen(true);
                }}
                style={{
                  background:
                    'linear-gradient(90deg, #FFD700, #FFC300, #FFD700)', // Shiny gold gradient
                  color: '#000', // Black text for contrast
                  border: '3px solid #FFD700', // Gold border
                  padding: '18px 50px', // Adjusted padding for a larger feel
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 15px rgba(255, 215, 0, 0.8)', // Initial glow
                  transition: '0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0px 0px 30px rgba(255, 215, 0, 1), 0px 0px 50px rgba(255, 215, 0, 0.8)'; // Static aura effect
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0px 0px 15px rgba(255, 215, 0, 0.8)'; // Normal glow when not hovered
                }}
              >
                Get Started
              </Button>
              <button
                onClick={() => (window.location.href = '/chatland')}
                style={{
                  background:
                    'linear-gradient(90deg, #FFD700, #FFC300, #FFD700)',
                  color: '#000',
                  border: '3px solid #FFD700',
                  padding: '18px 50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 15px rgba(255, 215, 0, 0.8)',
                  transition: '0.3s ease-in-out',
                }}
              >
                Chat Room
              </button>
            </ButtonContainer>
            <FeaturesList
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '40px',
                padding: '30px 0',
                width: '100%',
                justifyItems: 'center',
              }}
            >
              {[
                {
                  icon: '🔒',
                  title: 'Decentralized',
                  description: 'Fully transparent and trustless system',
                },
                {
                  icon: '⚖️',
                  title: 'Provably Fair',
                  description: 'Verifiable randomness for all games',
                },
                {
                  icon: '⚡',
                  title: 'Instant Payouts',
                  description: 'Receive winnings immediately',
                },
                {
                  icon: '💬',
                  title: 'Chat Feature',
                  description: 'Seamless communication between hosts',
                },
                {
                  icon: '🕵️',
                  title: 'Anonymous',
                  description: 'Play without revealing your identity',
                },
                {
                  icon: '🌍',
                  title: 'Global Access',
                  description: 'Play from anywhere in the world',
                },
              ].map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  style={{
                    background: 'rgba(0, 255, 0, 0.15)',
                    border: '3px solid #00FF00',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0 6px 15px rgba(0, 255, 0, 0.5)',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '200%', // Increased width
                    display: 'grid',

                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <FeatureIcon
                    style={{
                      fontSize: '50px', // Increased icon size
                      marginBottom: '20px',
                      color: '#00FF00',
                      textShadow: '0px 0px 15px rgba(0, 255, 0, 1)',
                    }}
                  >
                    {feature.icon}
                  </FeatureIcon>
                  <FeatureTitle
                    style={{
                      fontWeight: 'bold',
                      fontSize: '22px', // Larger font size
                      letterSpacing: '1.2px',
                      marginBottom: '12px',
                      color: '#00FF00',
                      textShadow: '0px 0px 10px rgba(0, 255, 0, 1)',
                    }}
                  >
                    {feature.title}
                  </FeatureTitle>
                  <FeatureDescription
                    style={{
                      fontSize: '16px', // Increased text size
                      color: '#00FF00',
                      opacity: 0.9,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      maxWidth: '90%',
                    }}
                  >
                    {feature.description}
                  </FeatureDescription>
                </FeatureCard>
              ))}
            </FeaturesList>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            transition={pageTransition}
            style={{
              padding: '50px',
              background: 'rgba(0, 0, 0, 0.85)',
              borderRadius: '20px',
              boxShadow: '0px 20px 50px rgba(0, 255, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              color: '#00FF00',
              // maxWidth: '1400px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
            }}
          >
            {/* Header Section */}
            <motion.h1
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                textShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)',
                letterSpacing: '1.5px',
              }}
              whileHover={{ scale: 1.02 }}
            >
              🎲 LimeDraw Dashboard 🎲
            </motion.h1>

            <motion.p
              style={{
                fontSize: '18px',
                color: '#fff',
                opacity: 0.9,
                maxWidth: '800px',
                margin: '0 auto',
                textShadow: '0px 0px 5px rgba(255, 255, 255, 0.3)',
              }}
              whileHover={{ scale: 1.01 }}
            >
              Welcome to your LimeDraw dashboard. Create or join a lottery for a
              chance to{' '}
              <motion.strong
                style={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textShadow: '0px 0px 10px rgba(255, 215, 0, 0.8)',
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                win big
              </motion.strong>
              . Blockchain ensures{' '}
              <motion.strong
                style={{
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textShadow: '0px 0px 10px rgba(255, 215, 0, 0.8)',
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                transparency and fairness
              </motion.strong>{' '}
              in every draw.
            </motion.p>

            {/* Lottery Stats Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                marginTop: '20px',
              }}
            >
              <motion.div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                  minWidth: '200px',
                  textAlign: 'center',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    color: '#00FF00',
                    textShadow: '0px 0px 10px rgba(0, 255, 0, 0.6)',
                  }}
                >
                  💰 HUB OF CRYPTO LOTTRIES
                </h3>
              </motion.div>

              <motion.div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                  minWidth: '200px',
                  textAlign: 'center',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    color: '#00FF00',
                    textShadow: '0px 0px 10px rgba(0, 255, 0, 0.6)',
                  }}
                >
                  🎟 YOU CAN NOW PURCHASE MULTIPLE TICKETS
                </h3>
              </motion.div>

              <motion.div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                  minWidth: '200px',
                  textAlign: 'center',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    color: '#00FF00',
                    textShadow: '0px 0px 10px rgba(0, 255, 0, 0.6)',
                  }}
                >
                  🏆 PLAY AND WIN BIG
                </h3>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '30px' }}>
              {lottery.name === '' ? (
                <motion.button
                  style={{
                    backgroundColor: '#00FF00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    padding: '14px 28px',
                    fontSize: '18px',
                    boxShadow: '0px 6px 18px rgba(0, 255, 0, 0.6)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentView('createLottery');
                    sessionStorage.setItem('currentView', 'createLottery');
                  }}
                >
                  🚀 Create a Lottery
                </motion.button>
              ) : (
                <motion.button
                  style={{
                    backgroundColor: '#00FF00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    padding: '14px 28px',
                    fontSize: '18px',
                    boxShadow: '0px 6px 18px rgba(0, 255, 0, 0.6)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentView('lotteryDetails');
                    sessionStorage.setItem('currentView', 'lotteryDetails');
                  }}
                >
                  🎯 Join Lottery
                </motion.button>
              )}
            </div>
          </motion.div>
        );

      case 'createLottery':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            transition={pageTransition}
            style={{
              padding: '3rem 2rem',
              width: '1000px',
              margin: 'auto',
              background: 'linear-gradient(145deg, #f0f9f0, #e0f9e0)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 128, 0, 0.1)',
              border: '2px solid #00FF00',
            }}
          >
            <h2
              style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#2a7f34',
                marginBottom: '1.8rem',
              }}
            >
              Create a New Lottery
            </h2>

            <form
              onSubmit={handleCreateLottery}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.8rem',
              }}
            >
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Lottery Name"
                value={createLotteryForm.name}
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem 1.5rem',
                  border: '1px solid #00FF00',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  outline: 'none',
                  transition: '0.3s all ease',
                  backgroundColor: '#f9fff5',
                }}
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Description (Optional)"
                value={createLotteryForm.description}
                onChange={handleInputChange}
                style={{
                  padding: '1rem',
                  border: '1px solid #00FF00',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: '#f9fff5',
                  resize: 'vertical',
                }}
              />

              {/* Ticket Price */}
              <input
                type="number"
                name="ticketPrice"
                placeholder="Ticket Price"
                value={
                  createLotteryForm.ticketPrice === 0
                    ? ''
                    : createLotteryForm.ticketPrice
                }
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem 1.5rem',
                  border: '1px solid #00FF00',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  outline: 'none',
                  backgroundColor: '#f9fff5',
                }}
                onWheel={(e) => e.currentTarget.blur()} // Disable number scroll
              />

              {/* Total Tickets */}
              <input
                type="number"
                name="totalTickets"
                placeholder="Total Number of Tickets"
                value={
                  createLotteryForm.totalTickets === 0
                    ? ''
                    : createLotteryForm.totalTickets
                }
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem 1.5rem',
                  border: '1px solid #00FF00',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  outline: 'none',
                  backgroundColor: '#f9fff5',
                }}
                onWheel={(e) => e.currentTarget.blur()} // Disable number scroll
              />

              {/* Winner Announcement Date */}
              <input
                type="datetime-local"
                name="winnerAnnouncementDate"
                placeholder="Winner Announcement Date"
                value={createLotteryForm.winnerAnnouncementDate}
                onChange={handleInputChange}
                required
                style={{
                  padding: '1rem 1.5rem',
                  border: '1px solid #00FF00',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  outline: 'none',
                  backgroundColor: '#f9fff5',
                }}
              />

              {/* Prize Pool */}

              {/* Submit Button */}
              <motion.button
                type="submit"
                style={{
                  background: 'linear-gradient(45deg, #00FF00, #32CD32)',
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontSize: '1.2rem',
                  width: '500px',
                  margin: 'auto',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 'bold',
                  display: 'block',
                  textAlign: 'center',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Lottery
              </motion.button>
            </form>
          </motion.div>
        );

      case 'lotteryDetails':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: '3rem 2rem',
              maxWidth: '900px', // Increased width
              margin: 'auto',
              background: 'linear-gradient(145deg, #f0f9f0, #e0f9e0)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 128, 0, 0.1)',
              border: '2px solid #00FF00',
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#2a7f34',
                marginBottom: '2rem',
              }}
            >
              Lottery Dashboard
            </h2>

            {lottery && lottery.owner && (
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f5fff0',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0, 255, 0, 0.2)',
                  marginBottom: '2rem',
                }}
              >
                <h2
                  style={{
                    color: '#2a7f34',
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {lottery.name}
                </h2>
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#666',
                    marginBottom: '1rem',
                  }}
                >
                  {lottery.description}
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#008000',
                  }}
                >
                  Ticket Price: ${lottery.ticket_price}
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#008000',
                  }}
                >
                  Total Tickets: {lottery.ticket_count}
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#d9534f',
                  }}
                >
                  Tickets Remaining: {remTickets}
                </p>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  background: '#d4f8d4',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0, 255, 0, 0.2)',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ fontSize: '1.5rem', color: '#2a7f34' }}>
                  Total Members
                </h3>
                <p
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#008000',
                  }}
                >
                  {Number(totalPlayer) + 1}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: '2rem',
                background: '#d4f8d4',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 128, 0, 0.2)',
              }}
            >
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#2a7f34',
                  textAlign: 'center',
                }}
              >
                Buy Tickets
              </h2>
              <form
                onSubmit={handleBuyTickets}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  alignItems: 'center',
                  marginTop: '1rem',
                }}
              >
                <input
                  type="number"
                  min="1"
                  value={ticketsToBuy}
                  onChange={(e) => setTicketsToBuy(Number(e.target.value))}
                  placeholder="Number of tickets"
                  required
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    border: '2px solid #00FF00',
                    borderRadius: '10px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: '0.3s all ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00FF00';
                    e.target.style.boxShadow = '0 0 8px rgba(0, 255, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#00FF00';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  type="submit"
                  style={{
                    background: 'linear-gradient(45deg, #00FF00, #32CD32)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Buy Tickets
                </motion.button>
              </form>
              {lottery && (
                <p
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#008000',
                    textAlign: 'center',
                    marginTop: '1rem',
                  }}
                >
                  Total Cost: $
                  {(Number(lottery.ticketPrice) * ticketsToBuy).toFixed(2)}
                </p>
              )}
            </div>
          </motion.div>
        );
      case 'hostDashboard':
        return (
          <HostDashboardContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            style={{
              padding: '50px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              borderRadius: '20px',
              boxShadow: '0px 20px 50px rgba(0, 255, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              color: '#00FF00',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              maxWidth: '1400px',
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <Title
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#00FF00',
                textShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)',
                letterSpacing: '1.5px',
                textAlign: 'center',
                marginBottom: '40px',
              }}
            >
              Host Dashboard
            </Title>

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
            >
              <Button
                style={{
                  background: 'linear-gradient(45deg, #00FF00, #00CC00)',
                  color: '#000',
                  border: '2px solid #00FF00',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  padding: '16px 32px',
                  fontSize: '16px',
                  boxShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)',
                  transition: 'all 0.3s ease-in-out',
                  flex: '1',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 0px 25px rgba(0, 255, 0, 1)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateDashboard}
              >
                Update Dashboard
              </Button>
              <Button
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)', // Shiny golden gradient
                  color: '#000', // Dark text for contrast
                  border: '2px solid #DAA520', // Gold border
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  padding: '16px 32px',
                  fontSize: '16px',
                  boxShadow: '0px 0px 15px rgba(255, 215, 0, 0.8)', // Glow effect
                  transition: '0.3s ease-in-out',
                  flex: '1',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 0px 25px rgba(255, 215, 0, 1)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWinner}
              >
                Declare Winner
              </Button>
            </div>

            {lottery && (
              <LotteryInfo
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                <h2
                  style={{
                    color: '#00FF00',
                    textShadow: '0px 0px 10px rgba(0, 255, 0, 0.6)',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontSize: '24px',
                  }}
                >
                  {lottery.name}
                </h2>
                <p
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    textAlign: 'center',
                    marginBottom: '10px',
                  }}
                >
                  {lottery.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <InfoItem
                    style={{
                      fontSize: '18px',
                      color: '#00FF00',
                      textAlign: 'center',
                      animation: 'fadeIn 1s ease-in-out',
                    }}
                  >
                    Ticket Price: ${lottery.ticket_price}
                  </InfoItem>
                  <InfoItem
                    style={{
                      fontSize: '18px',
                      color: '#00FF00',
                      textAlign: 'center',
                      animation: 'fadeIn 1s ease-in-out',
                    }}
                  >
                    Total Tickets: {lottery.ticket_count}
                  </InfoItem>
                  <InfoItem
                    style={{
                      fontSize: '18px',
                      color: '#00FF00',
                      textAlign: 'center',
                      animation: 'fadeIn 1s ease-in-out',
                    }}
                  >
                    Tickets Remaining: {remTickets}
                  </InfoItem>
                </div>
              </LotteryInfo>
            )}

            <StatisticsGrid
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                justifyItems: 'center',
              }}
            >
              <StatCard
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                  transition: 'transform 0.3s ease-in-out',
                  alignSelf: 'center',
                }}
              >
                <h3
                  style={{
                    color: '#00FF00',
                    textAlign: 'center',
                    fontSize: '20px',
                  }}
                >
                  Total Members
                </h3>
                <p
                  style={{
                    color: '#fff',
                    fontSize: '30px',
                    textAlign: 'center',
                    animation: 'fadeIn 1s ease-in-out',
                    fontWeight: 'bold',
                  }}
                >
                  {Number(totalPlayer) + 1}
                </p>
              </StatCard>
            </StatisticsGrid>

            {/* Host Roles Section */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
                marginTop: '40px',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  color: '#00FF00',
                  textAlign: 'center',
                  marginBottom: '15px',
                  textShadow: '0px 0px 10px rgba(0, 255, 0, 0.8)',
                }}
              >
                Host Roles
              </h3>
              <p
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                <strong>1. Manage Lottery Details:</strong> Ensure lottery
                information is accurate and updated.
              </p>
              <p
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  textAlign: 'center',
                  marginBottom: '10px',
                }}
              >
                <strong>2. Declare Winners:</strong> Randomly select winners
                when the lottery is complete.
              </p>
            </div>
          </HostDashboardContainer>
        );
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #003300, #006600)',
            color: '#00FF00',
            borderBottom: '3px solid #00FF00',
            boxShadow: '0px 4px 15px rgba(0, 255, 0, 0.4)',
            borderRadius: '0 0 20px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glowing Border Effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '3px',
              background:
                'linear-gradient(90deg, transparent, #00FF00, transparent)',
              animation: 'glowMove 2s linear infinite',
            }}
          ></div>

          {/* Logo & App Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '15px',
              transition: '0.3s',
            }}
            onClick={() => {
              setCurrentView('dashboard');
              sessionStorage.setItem('currentView', 'dashboard');
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={xyz}
              height="60px"
              width="60px"
              alt="LimeDraw Logo"
              style={{
                filter: 'drop-shadow(0px 0px 10px rgba(0, 255, 0, 0.8))',
                transition: '0.3s',
                marginRight: '1rem',
                borderRadius: '50%',
                boxShadow: '0px 0px 10px rgba(0, 255, 153, 0.5)',
              }}
            />

            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                textShadow: '0px 0px 10px rgba(0, 255, 0, 0.8)',
              }}
            >
              LimeDraw
            </span>
          </div>

          {/* Wallet Buttons & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!walletConnected ? (
              <button
                style={{
                  background: 'rgba(0, 255, 0, 0.2)',
                  color: '#00FF00',
                  border: '2px solid #00FF00',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 10px rgba(0, 255, 0, 0.7)',
                  transition: '0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0px 0px 20px rgba(0, 255, 0, 1)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0px 0px 10px rgba(0, 255, 0, 0.7)')
                }
                onClick={() => setIsWalletPopupOpen(true)}
              >
                Connect Wallet
              </button>
            ) : (
              <button
                style={{
                  background: 'rgba(0, 255, 0, 0.2)',
                  color: '#00FF00',
                  border: '2px solid #00FF00',
                  padding: '10px 18px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0px 0px 10px rgba(0, 255, 0, 0.7)',
                  transition: '0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0px 0px 20px rgba(0, 255, 0, 1)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0px 0px 10px rgba(0, 255, 0, 0.7)')
                }
                onClick={() => {
                  setWalletConnected(false);
                  setCurrentView('landing');
                  sessionStorage.setItem('currentView', 'landing');
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh', // Ensures it extends dynamically
            padding: '20px',
            position: 'relative',
            background: 'radial-gradient(circle, #0a0f1e, #020617)', // Retains the dark center background
            borderLeft: '3px solid #00FF00', // Green border on the left
            borderRight: '3px solid #00FF00', // Green border on the right
            overflowY: 'auto', // Enables scrolling when content is too long
            width: '100%', // Takes full width
          }}
        >
          {/* ✨ Animated Neon Grid Background */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background:
                "url('https://www.transparenttextures.com/patterns/graph-paper.png')",
              opacity: '0.08',
              animation: 'gridMove 10s linear infinite',
            }}
          ></div>

          {/* 🔥 Pulsing Neon Border Effect */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              border: '2px solid rgba(0, 255, 0, 0.5)', // Match header border color with slight adjustment
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
              animation: 'pulse 2s infinite alternate',
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
        {currentView === 'landing' && <HowItWorksSection></HowItWorksSection>}

        {currentView === 'landing' && (
          <TestimonialsSection></TestimonialsSection>
        )}

        <Footer></Footer>

        {isWalletPopupOpen && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWalletPopupOpen(true)}
          >
            <PopupContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <PopupTitle>Connect Your Wallet</PopupTitle>
              <WalletList>
                {['Plug'].map((wallet) => (
                  <WalletButton
                    id="connect-wallet-button"
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
  );
}
