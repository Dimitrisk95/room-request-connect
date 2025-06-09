
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useMobileFeatures = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      initializeMobileFeatures();
    }
  }, []);

  const initializeMobileFeatures = async () => {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      // Hide splash screen after initialization
      await SplashScreen.hide();
    } catch (error) {
      console.error('Error initializing mobile features:', error);
    }
  };

  const hapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (isNative) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.error('Status bar style error:', error);
      }
    }
  };

  return {
    isNative,
    hapticFeedback,
    setStatusBarStyle
  };
};
