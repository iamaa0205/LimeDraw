import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#003300",
        color: "#00FF00",
        padding: "20px",
        textAlign: "center",
        borderTop: "2px solid #00FF00",
      }}
    >
      <p>&copy; 2023 LimeDraw. All rights reserved.</p>
    </footer>
  )
}

export default Footer

