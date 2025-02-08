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

const TestimonialsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const testimonials = [
    {
      name: 'John D.',
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
          background:
            "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FF00' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          opacity: 0.1,
          zIndex: 1,
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
        Voices of Our Winners
      </motion.h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            style={{
              background: `rgba(0, 255, 0, ${hoveredIndex === index ? 0.15 : 0.1})`,
              border: '2px solid #00FF00',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: `0 8px 32px rgba(0, 255, 0, ${hoveredIndex === index ? 0.4 : 0.2})`,
              width: '300px',
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
              {testimonial.avatar}
            </div>
            <p
              style={{
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#00FF00',
                marginBottom: '20px',
                lineHeight: '1.6',
              }}
            >
              "{testimonial.feedback}"
            </p>
            <h4
              style={{
                fontWeight: 'bold',
                color: '#00FF00',
                fontSize: '18px',
                marginBottom: '10px',
              }}
            >
              {testimonial.name}
            </h4>
            <p
              style={{
                color: '#00FFFF',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Won {testimonial.winAmount}
            </p>
          </motion.div>
        ))}
      </div>
      <motion.p
        variants={fadeInUp}
        style={{
          fontSize: '14px',
          color: 'rgba(0, 255, 0, 0.7)',
          marginTop: '30px',
          fontStyle: 'italic',
        }}
      >
        Note: These are demo testimonials for display purposes only.
      </motion.p>
      
    </motion.div>
  );
};

export default TestimonialsSection;
