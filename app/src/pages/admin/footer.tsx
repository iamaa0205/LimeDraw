'use client';
import type React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerStyle: React.CSSProperties = {
    backgroundColor: '#001a00',
    color: '#00FF00',
    padding: '40px 20px',
    position: 'relative',
    marginTop: '50px',
    borderTop: '3px solid #00FF00',
    fontFamily: "'Arial', sans-serif",
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const sectionStyle: React.CSSProperties = {
    flex: '1 1 250px',
    marginBottom: '30px',
    marginRight: '20px',
  };

  const headingStyle: React.CSSProperties = {
    color: '#00FF00',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '15px',
    textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
  };

  const linkStyle: React.CSSProperties = {
    color: '#00FF00',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'block',
    margin: '10px 0',
    transition: 'all 0.3s ease',
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#003300',
    border: '1px solid #00FF00',
    color: '#00FF00',
    padding: '10px',
    fontSize: '14px',
    width: '100%',
    marginBottom: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#00FF00',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const copyrightStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '40px',
    borderTop: '1px solid rgba(0, 255, 0, 0.2)',
    paddingTop: '20px',
    fontSize: '14px',
  };

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
          <a href="mailto:omaren0248@gmail.com" style={linkStyle}>
            omaren0248@gmail.com
          </a>
          <a href="tel:+919878987655" style={linkStyle}>
            +(91) 9878987655
          </a>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href="https://twitter.com/0xcyanide"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Twitter
            </a>
            <a
              href="https://www.facebook.com/om.aren.3517/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/_aaditya_aren/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              Instagram
            </a>
          </div>
        </div>

        <div style={sectionStyle}>
          <h4 style={headingStyle}>Newsletter</h4>
          <p
            style={{ fontSize: '14px', marginBottom: '10px', color: '#00FF00' }}
          >
            Stay updated with our latest news and offers!
          </p>
          <input type="email" placeholder="Your email" style={inputStyle} />
          <button style={buttonStyle}>Subscribe</button>
        </div>
      </div>

      <div style={copyrightStyle}>
        <p>&copy; {currentYear} LimeDraw. All rights reserved.</p>
      </div>

      <style jsx>{`
        a:hover {
          color: #00ff99 !important;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
          transform: translateY(-2px);
        }

        button:hover {
          background-color: #00cc00;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
