import { Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { Button } from '../design-system/components/Button';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const setStorageItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // Fallback to sessionStorage if localStorage fails
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage not available');
    }
  }
};

const getStorageItem = (key: string) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

export const InstallPrompt = () => {
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const hasInteracted = getStorageItem('installPromptInteracted');
    if (!hasInteracted && auth?.user) {
      setIsOpen(true);
    }
  }, [auth?.user]);

  const handleClose = () => {
    setIsOpen(false);
    setStorageItem('installPromptInteracted', 'true');
  };

  const handleInstall = () => {
    handleInstallClick();
    setStorageItem('installPromptInteracted', 'true');
  };

  if (!isInstallable && !isIOS || !isOpen) return null;

  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 80,
      right: 20,
      maxWidth: 300,
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: 2,
      boxShadow: 3,
      zIndex: 1000
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" gutterBottom>
          {isIOS ? 'Install this app on your iOS device:' : 'Install this app on your device for the best experience'}
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleClose}
          sx={{ ml: 1, mt: -1, mr: -1 }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
      
      {isIOS ? (
        <>
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            onClick={() => {
              setShowIOSInstructions(true);
              localStorage.setItem('installPromptInteracted', 'true');
            }}
          >
            Show Instructions
          </Button>
          {showIOSInstructions && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" component="div">
                1. Tap the share button <span style={{ fontSize: '1.2em' }}>⎙</span><br/>
                2. Scroll and tap "Add to Home Screen" <br/>
                3. Tap "Add" to confirm
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Button 
          variant="contained" 
          color="primary"
          fullWidth
          onClick={handleInstall}
        >
          Install App
        </Button>
      )}
    </Box>
  );
};