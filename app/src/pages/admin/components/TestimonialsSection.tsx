import type React from "react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "John D.",
    feedback:
      "This is the most exciting lottery I've ever participated in! Fast payouts and an incredible user experience.",
    avatar: "👨‍💼",
    winAmount: "5,000 USDT",
  },
  {
    name: "Anna L.",
    feedback:
      "I love the transparency of the blockchain! It's reassuring to know my winnings are verifiable and secure.",
    avatar: "👩‍🔬",
    winAmount: "10,000 USDT",
  },
  {
    name: "Alex T.",
    feedback:
      "The system is intuitive and I can play from anywhere in the world. Crypto Lottery has revolutionized online gambling!",
    avatar: "🧑‍💻",
    winAmount: "7,500 USDT",
  },
  {
    name: "Sarah M.",
    feedback:
      "As a crypto enthusiast, I appreciate the innovative approach. The smart contracts ensure fairness and instant payouts.",
    avatar: "👩‍🚀",
    winAmount: "15,000 USDT",
  },
]

const TestimonialsSection: React.FC = () => {
  return (
    <section
      style={{
        padding: "50px 0",
        backgroundColor: "#002200",
        color: "#00FF00",
      }}
    >
      <h2
        style={{
          fontSize: "36px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        What Our Winners Say
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            style={{
              width: "300px",
              margin: "20px",
              padding: "20px",
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 255, 0, 0.1)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>{testimonial.avatar}</div>
            <h3 style={{ marginBottom: "10px" }}>{testimonial.name}</h3>
            <p style={{ marginBottom: "10px" }}>{testimonial.feedback}</p>
            <p style={{ fontWeight: "bold" }}>Won: {testimonial.winAmount}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection

