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
export default function App() {
  return (
    <AccessTokenWrapper getNodeUrl={getNodeUrl}>
      <BrowserRouter basename="/demo-blockchain-integrations/">
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/auth" element={<Authenticate />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/navigate" element={<CryptoLottery />} />
          <Route path="/counter" element={<CounterComponent />} />
          <Route path="/winner" element={<Winner />}/>
          
        </Routes>
      </BrowserRouter>
    </AccessTokenWrapper>
  );
}
