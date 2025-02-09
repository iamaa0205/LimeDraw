import type React from "react"
import { motion } from "framer-motion"
import { fadeInUp, pageTransition } from "../../styles/animations"

interface DashboardViewProps {
  lottery: any
  onJoinLottery: () => void
}

const DashboardView: React.FC<DashboardViewProps> = ({ lottery, onJoinLottery }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      transition={pageTransition}
      style={{
        padding: "50px",
        background: "rgba(0, 0, 0, 0.85)",
        borderRadius: "20px",
        boxShadow: "0px 20px 50px rgba(0, 255, 0, 0.6)",
        backdropFilter: "blur(12px)",
        color: "#00FF00",
        maxWidth: "1400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          textShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
          letterSpacing: "1.5px",
        }}
      >
        🎲 LimeDraw Dashboard 🎲
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#fff",
          opacity: 0.9,
          maxWidth: "800px",
          margin: "20px auto",
        }}
      >
        Welcome to your LimeDraw dashboard. Join a lottery for a chance to win big. Blockchain ensures transparency and
        fairness in every draw.
      </p>
      <div style={{ marginTop: "30px" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoinLottery}
          style={{
            backgroundColor: "#00FF00",
            color: "#000",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "14px 28px",
            fontSize: "18px",
            boxShadow: "0px 6px 18px rgba(0, 255, 0, 0.6)",
            cursor: "pointer",
          }}
        >
          🎯 Join Lottery
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DashboardView

