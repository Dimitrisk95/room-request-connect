
import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
  reduceMotion: boolean;
  screenReader: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  announceToScreenReader: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: "medium",
    reduceMotion: false,
    screenReader: false
  });

  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    // Load accessibility settings from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedSettings = localStorage.getItem("accessibility-settings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
        }
      } catch (error) {
        console.error("Failed to parse accessibility settings:", error);
      }

      // Detect if user prefers reduced motion
      if (window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          setSettings(prev => ({ ...prev, reduceMotion: true }));
        }
      }

      // Detect if screen reader is likely being used
      if (window.navigator) {
        const hasScreenReader = window.navigator.userAgent.includes('NVDA') || 
                                window.navigator.userAgent.includes('JAWS') ||
                                (window.speechSynthesis && typeof window.speechSynthesis !== 'undefined');
        if (hasScreenReader) {
          setSettings(prev => ({ ...prev, screenReader: true }));
        }
      }
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to document
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${settings.fontSize}`);

    // Reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Save settings
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem("accessibility-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save accessibility settings:", error);
      }
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
      {children}
      
      {/* Screen reader announcements */}
      {typeof document !== 'undefined' && (
        <div 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {announcements.map((announcement, index) => (
            <div key={index}>{announcement}</div>
          ))}
        </div>
      )}
    </AccessibilityContext.Provider>
  );
};

// Accessibility CSS to be added to index.css
export const accessibilityCSS = `
/* High contrast mode */
.high-contrast {
  --background: #000000;
  --foreground: #ffffff;
  --muted: #333333;
  --muted-foreground: #cccccc;
  --border: #ffffff;
  --primary: #ffffff;
  --primary-foreground: #000000;
}

/* Font size adjustments */
.font-small {
  font-size: 14px;
}

.font-medium {
  font-size: 16px;
}

.font-large {
  font-size: 18px;
}

/* Reduced motion */
.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
`;
