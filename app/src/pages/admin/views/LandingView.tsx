import type React from "react"
import { motion } from "framer-motion"
import { Title, Description, FeaturesList, ButtonContainer } from "../../styles/landingStyles"
import { fadeInUp, pageTransition } from "../../styles/animations"

interface LandingViewProps {
  onGetStarted: () => void
}

const LandingView: React.FC<LandingViewProps> = ({ onGetStarted }) => {
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
      <Title>Welcome to LimeDraw</Title>
      <Description>
        Step into the future of lotteries with <span>LimeDraw</span>. Experience the thrill of fair, transparent, and
        exciting games powered by cutting-edge blockchain technology. Your chance to win big awaits!
      </Description>
      <FeaturesList>{/* Feature cards here */}</FeaturesList>
      <ButtonContainer>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          style={{
            background: "linear-gradient(90deg, #FFD700, #FFC300, #FFD700)",
            color: "#000",
            border: "3px solid #FFD700",
            padding: "18px 50px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.8)",
            transition: "0.3s ease-in-out",
          }}
        >
          Get Started
        </motion.button>
      </ButtonContainer>
    </motion.div>
  )
}

export default LandingView

