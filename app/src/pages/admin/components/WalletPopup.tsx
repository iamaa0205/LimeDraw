import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WalletPopupProps {
  isOpen: boolean
  onClose: () => void
  onConnectWallet: (wallet: string) => void
}

const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose, onConnectWallet }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              backgroundColor: "#001a00",
              padding: "20px",
              borderRadius: "10px",
              width: "300px",
            }}
          >
            <h2 style={{ color: "#00FF00", marginBottom: "20px", textAlign: "center" }}>Connect Your Wallet</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Plug"].map((wallet) => (
                <motion.button
                  key={wallet}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onConnectWallet(wallet)}
                  style={{
                    backgroundColor: "#00FF00",
                    color: "#000",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {wallet}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WalletPopup

