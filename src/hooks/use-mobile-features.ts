
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Camera } from '@capacitor/camera';

export const useMobileFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      initializeMobileFeatures();
      checkCameraPermissions();
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

  const checkCameraPermissions = async () => {
    try {
      const permissions = await Camera.checkPermissions();
      setCameraPermission(permissions.camera);
    } catch (error) {
      console.error('Error checking camera permissions:', error);
    }
  };

  const requestCameraPermissions = async () => {
    try {
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      setCameraPermission(result.camera);
      return result.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
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
    cameraPermission,
    hapticFeedback,
    setStatusBarStyle,
    requestCameraPermissions,
    checkCameraPermissions
  };
};
