export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`

export const glowingEffect = keyframes`
  0% { box-shadow: 0 0 5px #4a90e2, 0 0 10px #4a90e2, 0 0 15px #4a90e2, 0 0 20px #4a90e2; }
  50% { box-shadow: 0 0 10px #4a90e2, 0 0 20px #4a90e2, 0 0 30px #4a90e2, 0 0 40px #4a90e2; }
  100% { box-shadow: 0 0 5px #4a90e2, 0 0 10px #4a90e2, 0 0 15px #4a90e2, 0 0 20px #4a90e2; }
`

export const pulsingEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

export const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
`

export const AppName = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const Button = styled(motion.button)`
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    animation: ${glowingEffect} 1.5s infinite;
  }
`

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex-grow: 1;
`

export const Title = styled(motion.h2)`
  font-size: 2.8rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`

export const Description = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-align: center;
  color: #ecf0f1;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

export const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`

export const FeatureCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`

export const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`

export const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`

export const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #cccccc;
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`

export const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

export const LotteryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`

export const LotteryCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`

export const Footer = styled.footer`
  background-color: rgba(26, 26, 46, 0.8);
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
`

export const SearchBar = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

export const SearchInput = styled(Input)`
  flex-grow: 1;
`

export const SearchButton = styled(Button)`
  margin-left: 0.5rem;
`

export const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

export const PopupContent = styled(motion.div)`
  background-color: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
`

export const PopupTitle = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
`

export const WalletList = styled.div`
  display: grid;
  gap: 1rem;
`

export const WalletButton = styled(motion.button)`
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #34495e;
  }
`

export const LotteryDetailsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

export const LotteryHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`

export const LotteryName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`

export const LotteryDescription = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #a0aec0;
`

export const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`

export const CreatorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`

export const CreatorAddress = styled.span`
  font-size: 0.9rem;
  color: #a0aec0;
`

export const CountdownContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const CountdownTimer = styled.div<{ urgent: boolean }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a90e2;
  ${(props) =>
    props.urgent &&
    css`
      animation: ${pulsingEffect} 1.5s infinite;
    `}
`

export const CountdownLabel = styled.div`
  font-size: 1rem;
  color: #a0aec0;
  margin-top: 0.5rem;
`

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

export const DetailCard = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

export const DetailIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4a90e2;
`

export const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
`

export const DetailValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
`

export const MembersSection = styled.section`
  margin-bottom: 2rem;
`

export const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 1rem;
`

export const MemberAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TotalMembers = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #a0aec0;
`

export const BuyTicketsSection = styled.section`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
`

export const BuyTicketsForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const TicketInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
  }
`

export const BuyButton = styled(motion.button)`
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(45deg, #4a90e2, #63b3ed);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: ${glowingEffect} 1.5s infinite;
  }
`

export const TotalCost = styled.div`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #a0aec0;
`

export const HostDashboardContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export const LotteryInfo = styled.div`
  margin-bottom: 2rem;
`

export const InfoItem = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`

export const StatCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
`

export const MembersList = styled.ul`
  list-style-type: none;
  padding: 0;
`

export const MemberItem = styled.li`
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
`

export const NotificationWindow = styled.div`
  height: 200px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  margin-top: 2rem;
`

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

// WalletStatus component
export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`

export const StatusDot = styled.div<{ connected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.connected ? "#4CAF50" : "#FF5722")};
  margin-right: 0.5rem;
`

export const StatusText = styled.span`
  font-size: 0.9rem;
  color: #ffffff;
`