import type React from "react"
import { motion } from "framer-motion"

const HowItWorksSection: React.FC = () => {
  const steps = [
    { title: "Connect Wallet", description: "Link your crypto wallet to participate in lotteries." },
    { title: "Choose a Lottery", description: "Browse available lotteries and select one to join." },
    { title: "Buy Tickets", description: "Purchase tickets using cryptocurrency." },
    { title: "Wait for the Draw", description: "Draws are conducted using verifiable random functions." },
    { title: "Claim Prizes", description: "If you win, prizes are automatically sent to your wallet." },
  ]

  return (
    <section
      style={{
        padding: "50px 0",
        backgroundColor: "#001a00",
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
        How It Works
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            style={{
              width: "200px",
              margin: "20px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorksSection

