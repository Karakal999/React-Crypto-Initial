import React, { createContext, useContext, useState, useEffect } from 'react';
import { fakeFetchCrypto } from '../api';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './authContext';

const CryptoContext = createContext({
  crypto: [],
  assets: [],
  loading: false,
  addAsset: () => {},
  removeAsset: () => {},
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function preload() {
      setLoading(true);
      try {
        const cryptoResponse = await fakeFetchCrypto();
        setCrypto(cryptoResponse.result || []);
      } catch (error) {
        console.error('Error loading crypto data:', error);
      } finally {
        setLoading(false);
      }
    }
    preload();
  }, []);

  useEffect(() => {
    if (!user) {
      setAssets([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), doc => {
      if (doc.exists()) {
        setAssets(doc.data().assets || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addAsset = async asset => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const newAssets = [...assets];
    const existingIndex = newAssets.findIndex(a => a.id === asset.id);

    if (existingIndex >= 0) {
      newAssets[existingIndex].amount += asset.amount;
    } else {
      newAssets.push(asset);
    }

    await updateDoc(userRef, {
      assets: newAssets,
    });
  };

  const removeAsset = async assetId => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const newAssets = assets.filter(a => a.id !== assetId);

    await updateDoc(userRef, {
      assets: newAssets,
    });
  };

  return (
    <CryptoContext.Provider
      value={{
        loading,
        crypto,
        assets,
        addAsset,
        removeAsset,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  return useContext(CryptoContext);
}
