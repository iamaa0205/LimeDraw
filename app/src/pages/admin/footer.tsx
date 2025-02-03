'use client'
import type React from "react"


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#001a00",
    color: "#00FF00",
    padding: "40px 20px",
    position: "relative",
    marginTop: "50px",
    borderTop: "3px solid #00FF00",
    fontFamily: "'Arial', sans-serif",
  }

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
  }

  const sectionStyle: React.CSSProperties = {
    flex: "1 1 250px",
    marginBottom: "30px",
    marginRight: "20px",
  }

  const headingStyle: React.CSSProperties = {
    color: "#00FF00",
    fontSize: "18px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "15px",
    textShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
  }

  const linkStyle: React.CSSProperties = {
    color: "#00FF00",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
    margin: "10px 0",
    transition: "all 0.3s ease",
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#003300",
    border: "1px solid #00FF00",
    color: "#00FF00",
    padding: "10px",
    fontSize: "14px",
    width: "100%",
    marginBottom: "10px",
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#00FF00",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }

  const copyrightStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "40px",
    borderTop: "1px solid rgba(0, 255, 0, 0.2)",
    paddingTop: "20px",
    fontSize: "14px",
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h4 style={headingStyle}>Quick Links</h4>
          <a href="#about" style={linkStyle}>
            About Us
          </a>
          <a href="#how-it-works" style={linkStyle}>
            How It Works
          </a>
          <a href="#faq" style={linkStyle}>
            FAQ
          </a>
          <a href="#terms" style={linkStyle}>
            Terms & Conditions
          </a>
          <a href="#privacy" style={linkStyle}>
            Privacy Policy
          </a>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Contact</h4>
          <a href="mailto:support@cryptolottery.com" style={linkStyle}>
            support@cryptolottery.com
          </a>
          <a href="tel:+1234567890" style={linkStyle}>
            +1 (234) 567-890
          </a>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Follow Us</h4>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://twitter.com/cryptolottery" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Twitter
            </a>
            <a href="https://facebook.com/cryptolottery" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Facebook
            </a>
            <a href="https://instagram.com/cryptolottery" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Instagram
            </a>
          </div>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Newsletter</h4>
          <p style={{ fontSize: "14px", marginBottom: "10px", color: "#00FF00" }}>
            Stay updated with our latest news and offers!
          </p>
          <input type="email" placeholder="Your email" style={inputStyle} />
          <button style={buttonStyle}>Subscribe</button>
        </div>
      </div>

      <div style={copyrightStyle}>
        <p>&copy; {currentYear} Crypto Lottery. All rights reserved.</p>
      </div>

      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "3px",
          background: "linear-gradient(90deg, transparent, #00FF00, transparent)",
          animation: "glowMove 2s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes glowMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        a:hover {
          color: #00FF99 !important;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
          transform: translateY(-2px);
        }

        button:hover {
          background-color: #00CC00;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
        }
      `}</style>
    </footer>
  )
}

export default Footer

