import type React from "react"
import { motion } from "framer-motion"
import { WalletStatus } from "./WalletStatus"
import { Logo } from "../styles/headerStyles"

interface HeaderProps {
  walletConnected: boolean
  onConnectWallet: () => void
  onDisconnectWallet: () => void
  onLogoClick: () => void
}

const Header: React.FC<HeaderProps> = ({ walletConnected, onConnectWallet, onDisconnectWallet, onLogoClick }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "linear-gradient(135deg, #003300, #006600)",
        color: "#00FF00",
        borderBottom: "3px solid #00FF00",
        boxShadow: "0px 4px 15px rgba(0, 255, 0, 0.4)",
        borderRadius: "0 0 20px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Logo onClick={onLogoClick} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!walletConnected ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "rgba(0, 255, 0, 0.2)",
              color: "#00FF00",
              border: "2px solid #00FF00",
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
              transition: "0.3s",
            }}
            onClick={onConnectWallet}
          >
            Connect Wallet
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "rgba(0, 255, 0, 0.2)",
              color: "#00FF00",
              border: "2px solid #00FF00",
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
              transition: "0.3s",
            }}
            onClick={onDisconnectWallet}
          >
            Disconnect Wallet
          </motion.button>
        )}
        <WalletStatus connected={walletConnected} />
      </div>
    </header>
  )
}

export default Header

