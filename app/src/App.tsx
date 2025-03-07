import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home';
import SetupPage from './pages/setup';
import Authenticate from './pages/login/Authenticate';
import { AccessTokenWrapper } from '@calimero-is-near/calimero-p2p-sdk';
import { getNodeUrl } from './utils/node';
import CryptoLottery from './pages/admin/navigate';
import CounterComponent from './pages/admin/counter';
import Winner from './pages/admin/winner';
import { useEffect } from 'react';
import Check from './pages/admin/check';
import ChatLand from './pages/admin/chatLand';
import ChatRoom from './pages/admin/chatRoom';
import { Toaster } from 'react-hot-toast';
export default function App() {
  useEffect(() => {
    // Check if the URL matches the base path
    if (window.location.pathname === '/') {
      // Only set "landing" if no view is already stored

      sessionStorage.setItem('currentView', 'landing');
    }
  }, []);

  return (
    <AccessTokenWrapper getNodeUrl={getNodeUrl}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/auth" element={<Authenticate />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/navigate" element={<CryptoLottery />} />
          <Route path="/counter" element={<CounterComponent />} />
          <Route path="/winner" element={<Winner />} />
          <Route path="/check" element={<Check />} />
          <Route path="/chatland" element={<ChatLand />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
      <Toaster /> 
    </AccessTokenWrapper>
  );
}
