import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CryptoContextProvider } from './context/cryptoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CryptoContextProvider>
      <App />
    </CryptoContextProvider>
  </React.StrictMode>
);
