/**
 * BleContext
 *
 * Single source of truth for the BleManager instance and Bluetooth state.
 *
 * - Creates ONE BleManager inside useEffect (never during render)
 * - Owns the onStateChange subscription so timing is correct
 * - Passes the manager ref + BT state to both hooks
 * - Gracefully handles the native module being unavailable (Expo Go)
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';
import useBleHost from '../ble/useBleHost';
import useBlePlayer from '../ble/useBlePlayer';

const BleContext = createContext(null);

export function BleProvider({ children }) {
  const managerRef = useRef(null);
  const [bleReady, setBleReady] = useState(false);
  const [bleError, setBleError] = useState(null);

  useEffect(() => {
    let mgr;
    let sub;

    try {
      mgr = new BleManager();
      managerRef.current = mgr;

      sub = mgr.onStateChange(state => {
        if (state === 'PoweredOn') {
          setBleReady(true);
          setBleError(null);
        } else if (state === 'PoweredOff' || state === 'Unauthorized' || state === 'Unsupported') {
          setBleReady(false);
          setBleError('Bluetooth is off or unauthorised. Please enable it and try again.');
        }
      }, true);
    } catch (e) {
      // Native module not available — requires a development build, not Expo Go
      setBleError('Bluetooth requires a development build. Run: npx expo run:ios / run:android');
    }

    return () => {
      sub?.remove();
      mgr?.destroy();
      managerRef.current = null;
    };
  }, []);

  const host = useBleHost(managerRef, bleReady, bleError);
  const player = useBlePlayer(managerRef, bleReady, bleError);

  return (
    <BleContext.Provider value={{ host, player }}>
      {children}
    </BleContext.Provider>
  );
}

export function useBle() {
  const ctx = useContext(BleContext);
  if (!ctx) throw new Error('useBle must be used within a BleProvider');
  return ctx;
}
