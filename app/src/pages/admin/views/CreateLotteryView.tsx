"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInUp, pageTransition } from "../../styles/animations"

interface CreateLotteryViewProps {
  onCreateLottery: (lotteryData: any) => void
}

const CreateLotteryView: React.FC<CreateLotteryViewProps> = ({ onCreateLottery }) => {
  const [lotteryForm, setLotteryForm] = useState({
    name: "",
    description: "",
    ticketPrice: "",
    totalTickets: "",
    winnerAnnouncementDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLotteryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateLottery(lotteryForm)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      transition={pageTransition}
      style={{
        padding: "3rem 2rem",
        width: "1000px",
        margin: "auto",
        background: "linear-gradient(145deg, #f0f9f0, #e0f9e0)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 128, 0, 0.1)",
        border: "2px solid #00FF00",
      }}
    >
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#2a7f34",
          marginBottom: "1.8rem",
        }}
      >
        Create a New Lottery
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.8rem",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Lottery Name"
          value={lotteryForm.name}
          onChange={handleInputChange}
          required
          style={{
            padding: "1rem 1.5rem",
            border: "1px solid #00FF00",
            borderRadius: "10px",
            fontSize: "1.1rem",
            outline: "none",
            transition: "0.3s all ease",
            backgroundColor: "#f9fff5",
          }}
        />
        <textarea
          name="description"
          placeholder="Description (Optional)"
          value={lotteryForm.description}
          onChange={handleInputChange}
          style={{
            padding: "1rem",
            border: "1px solid #00FF00",
            borderRadius: "10px",
            fontSize: "1rem",
            outline: "none",
            backgroundColor: "#f9fff5",
            resize: "vertical",
          }}
        />
        <input
          type="number"
          name="ticketPrice"
          placeholder="Ticket Price"
          value={lotteryForm.ticketPrice}
          onChange={handleInputChange}
          required
          style={{
            padding: "1rem 1.5rem",
            border: "1px solid #00FF00",
            borderRadius: "10px",
            fontSize: "1.1rem",
            outline: "none",
            backgroundColor: "#f9fff5",
          }}
        />
        <input
          type="number"
          name="totalTickets"
          placeholder="Total Number of Tickets"
          value={lotteryForm.totalTickets}
          onChange={handleInputChange}
          required
          style={{
            padding: "1rem 1.5rem",
            border: "1px solid #00FF00",
            borderRadius: "10px",
            fontSize: "1.1rem",
            outline: "none",
            backgroundColor: "#f9fff5",
          }}
        />
        <input
          type="datetime-local"
          name="winnerAnnouncementDate"
          placeholder="Winner Announcement Date"
          value={lotteryForm.winnerAnnouncementDate}
          onChange={handleInputChange}
          required
          style={{
            padding: "1rem 1.5rem",
            border: "1px solid #00FF00",
            borderRadius: "10px",
            fontSize: "1.1rem",
            outline: "none",
            backgroundColor: "#f9fff5",
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
            width: "500px",
            margin: "auto",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontWeight: "bold",
          }}
        >
          Create Lottery
        </motion.button>
      </form>
    </motion.div>
  )
}

export default CreateLotteryView

