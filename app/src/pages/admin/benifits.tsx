'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const HowItWorksSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const steps = [
    {
      step: 'Step 1',
      title: 'Connect Wallet 🔗',
      description:
        'Use Plug wallet to connect securely. No personal details required—stay anonymous!',
      icon: '🔗',
      color: '#00ff00',
    },
    {
      step: 'Step 2',
      title: 'Buy Lottery Tickets 🎟️',
      description:
        'Buy as many tickets as you want. Pay with ICP cryptocurrency.',
      icon: '🎟️',
      color: '#00ffff',
    },
    {
      step: 'Step 3',
      title: 'Join the Draw 🎰',
      description:
        'Your ticket(s) are entered into the smart contract. The draw is conducted transparently on the blockchain.',
      icon: '🎰',
      color: '#ff00ff',
    },
    {
      step: 'Step 4',
      title: 'Wait for the Results ⏳',
      description:
        'The lottery closes at a fixed time. A fair and verifiable random number selects the winner.',
      icon: '⏳',
      color: '#ffff00',
    },
    {
      step: 'Step 5',
      title: 'Claim Winnings 🏆',
      description:
        'If you win, the smart contract automatically transfers funds to your wallet. No intermediaries—100% decentralized!',
      icon: '🏆',
      color: '#ff8000',
    },
    {
      step: 'Step 6',
      title: 'Verify & Repeat 🔄',
      description:
        'Check past draws on the blockchain for transparency. Play again for more chances to win!',
      icon: '🔄',
      color: '#00ccff',
    },
  ];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      transition={pageTransition}
      style={{
        background: 'linear-gradient(135deg, #020617, #0a0f1e)',
        padding: '80px 30px',
        textAlign: 'center',
        color: '#00FF00',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, transparent 20%, #020617 70%)',
          opacity: 0.1,
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      />
      <motion.h2
        variants={fadeInUp}
        style={{
          fontSize: '42px',
          fontWeight: 'bold',
          letterSpacing: '3px',
          marginBottom: '60px',
          textShadow: '0px 0px 15px rgba(0, 255, 0, 0.8)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        How LimeDraw Works
      </motion.h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            style={{
              background: `rgba(0, 255, 0, ${hoveredIndex === index ? 0.15 : 0.1})`,
              border: `2px solid ${item.color}`,
              padding: '30px',
              borderRadius: '15px',
              boxShadow: `0 6px 20px rgba(0, 255, 0, ${hoveredIndex === index ? 0.6 : 0.4})`,
              transition: 'all 0.3s ease-in-out',
              transform: hoveredIndex === index ? 'translateY(-10px)' : 'none',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}
            >
              {item.icon}
            </div>
            <h4
              style={{
                fontWeight: 'bold',
                fontSize: '24px',
                letterSpacing: '1px',
                marginBottom: '15px',
                color: item.color,
                textShadow: `0px 0px 8px ${item.color}`,
              }}
            >
              {item.step}: {item.title}
            </h4>
            <p
              style={{
                fontSize: '16px',
                color: '#00FF00',
                opacity: 0.9,
                lineHeight: '1.6',
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
      
    </motion.div>
  );
};

export default HowItWorksSection;
