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
      title: 'Enter the Lottery',
      description:
        'Choose your lucky numbers and enter the lottery pool using cryptocurrency.',
      icon: '🎟️',
      color: '#00ff00',
    },
    {
      step: 'Step 2',
      title: 'Verify Randomness',
      description:
        'Our blockchain-based system ensures all draws are verifiably fair and transparent.',
      icon: '🔍',
      color: '#00ffff',
    },
    {
      step: 'Step 3',
      title: 'Draw Winner',
      description:
        'Smart contracts randomly select the winner, with instant notification to all participants.',
      icon: '🏆',
      color: '#ff00ff',
    },
    {
      step: 'Step 4',
      title: 'Instant Payout',
      description:
        'Winners receive their crypto prizes directly in their wallet, no delays or intermediaries.',
      icon: '💰',
      color: '#ffff00',
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
        How Crypto Lottery Works
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '60px',
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#000',
          backgroundColor: '#00FF00',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        Start Your Crypto Lottery Journey
      </motion.button>
    </motion.div>
  );
};

export default HowItWorksSection;
