"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"

interface LotteryDetailsViewProps {
  lottery: any
  onBuyTickets: (amount: number) => void
}

const LotteryDetailsView: React.FC<LotteryDetailsViewProps> = ({ lottery, onBuyTickets }) => {
  const [ticketsToBuy, setTicketsToBuy] = useState(1)

  const handleBuyTickets = (e: React.FormEvent) => {
    e.preventDefault()
    onBuyTickets(ticketsToBuy)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "3rem 2rem",
        maxWidth: "900px",
        margin: "auto",
        background: "linear-gradient(145deg, #f0f9f0, #e0f9e0)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 128, 0, 0.1)",
        border: "2px solid #00FF00",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#2a7f34",
          marginBottom: "2rem",
        }}
      >
        Lottery Details
      </h2>
      <div
        style={{
          padding: "1.5rem",
          background: "#f5fff0",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 255, 0, 0.2)",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            color: "#2a7f34",
            fontSize: "1.8rem",
            marginBottom: "0.5rem",
          }}
        >
          {lottery.name}
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: "#666",
            marginBottom: "1rem",
          }}
        >
          {lottery.description}
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#008000",
          }}
        >
          Ticket Price: ${lottery.ticket_price}
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#008000",
          }}
        >
          Total Tickets: {lottery.ticket_count}
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#d9534f",
          }}
        >
          Tickets Remaining: {lottery.remaining_tickets}
        </p>
      </div>
      <div
        style={{
          padding: "2rem",
          background: "#d4f8d4",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 128, 0, 0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#2a7f34",
            textAlign: "center",
          }}
        >
          Buy Tickets
        </h2>
        <form
          onSubmit={handleBuyTickets}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            alignItems: "center",
            marginTop: "1rem",
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
              width: "100%",
              maxWidth: "300px",
              padding: "1rem",
              fontSize: "1.1rem",
              border: "2px solid #00FF00",
              borderRadius: "10px",
              textAlign: "center",
              outline: "none",
              transition: "0.3s all ease",
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "linear-gradient(45deg, #00FF00, #32CD32)",
              color: "#fff",
              border: "none",
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "bold",
            }}
          >
            Buy Tickets
          </motion.button>
        </form>
        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: "bold",
            color: "#008000",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Total Cost: ${(Number(lottery.ticket_price) * ticketsToBuy).toFixed(2)}
        </p>
      </div>
    </motion.div>
  )
}

export default LotteryDetailsView

