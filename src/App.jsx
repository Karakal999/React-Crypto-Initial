import React from 'react';
import { CryptoContextProvider } from './context/cryptoContext';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <CryptoContextProvider>
      <AppLayout/>
    </CryptoContextProvider>
  )
}


