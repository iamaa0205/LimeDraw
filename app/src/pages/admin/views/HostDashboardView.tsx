import type React from "react"
import { motion } from "framer-motion"

interface HostDashboardViewProps {
  lottery: any
  onUpdateDashboard: () => void
  onDeclareWinner: () => void
}

const HostDashboardView: React.FC<HostDashboardViewProps> = ({ lottery, onUpdateDashboard, onDeclareWinner }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7 }}
      style={{
        padding: "50px",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderRadius: "20px",
        boxShadow: "0px 20px 50px rgba(0, 255, 0, 0.6)",
        backdropFilter: "blur(12px)",
        color: "#00FF00",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "#00FF00",
          textShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
          letterSpacing: "1.5px",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Host Dashboard
      </h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(0, 255, 0, 1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpdateDashboard}
          style={{
            background: "linear-gradient(45deg, #00FF00, #00CC00)",
            color: "#000",
            border: "2px solid #00FF00",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "16px 32px",
            fontSize: "16px",
            boxShadow: "0px 0px 15px rgba(0, 255, 0, 0.8)",
            transition: "all 0.3s ease-in-out",
            flex: "1",
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          Update Dashboard
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(255, 215, 0, 1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onDeclareWinner}
          style={{
            background: "linear-gradient(45deg, #FFD700, #FFA500)",
            color: "#000",
            border: "2px solid #DAA520",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "16px 32px",
            fontSize: "16px",
            boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.8)",
            transition: "0.3s ease-in-out",
            flex: "1",
            textTransform: "uppercase",
            letterSpacing: "1px",
            cursor: "pointer",
          }}
        >
          Declare Winner
        </motion.button>
      </div>
      {lottery && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          <h2
            style={{
              color: "#00FF00",
              textShadow: "0px 0px 10px rgba(0, 255, 0, 0.6)",
              marginBottom: "10px",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            {lottery.name}
          </h2>
          <p
            style={{
              color: "#fff",
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {lottery.description}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "#00FF00",
                textAlign: "center",
                animation: "fadeIn 1s ease-in-out",
              }}
            >
              Ticket Price: ${lottery.ticket_price}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#00FF00",
                textAlign: "center",
                animation: "fadeIn 1s ease-in-out",
              }}
            >
              Total Tickets: {lottery.ticket_count}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#00FF00",
                textAlign: "center",
                animation: "fadeIn 1s ease-in-out",
              }}
            >
              Tickets Remaining: {lottery.remaining_tickets}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default HostDashboardView

