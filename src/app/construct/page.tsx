'use client';

import { useEffect, useState, CSSProperties, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './construct.module.css';

export default function ConstructPage() {
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Improved, more mysterious Matrix-style text
  const messages = useMemo(() => [
    "Knock, knock, fren...",
    "Construct initialization protocol interrupted.",
    "Access verification required: 50,000 $MATRIX tokens.",
    "Neural connection unstable: permissions denied.",
    "The Construct is still being built.",
    "Coming soon to those who have taken the red pill.",
    "Redirecting to base reality..."
  ], []);

  useEffect(() => {
    let isMounted = true;
    
    // Function for typing a single text message
    const typeMessage = async (text: string, delay = 30) => {
      if (!isMounted) return;
      
      for (let i = 0; i < text.length; i++) {
        if (!isMounted) return;
        
        await new Promise(resolve => 
          setTimeout(resolve, delay + Math.random() * 30)
        );
        
        if (isMounted) {
          setDisplayText(prev => prev + text[i]);
        }
      }
      
      // Add new line after message
      if (isMounted) {
        setDisplayText(prev => prev + '\n');
      }
    };
    
    // Function for the entire typing sequence
    const runSequence = async () => {
      // Wait before starting
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Type all messages with pauses between them
      for (const message of messages) {
        await typeMessage(message);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Start the loading bar
      if (isMounted) {
        setLoadingStarted(true);
        
        // Total loading time in milliseconds
        const totalLoadTime = 4000; // 4 seconds total loading time
        const startTime = Date.now();
        
        // Calculate progress based on actual time
        const interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval);
            return;
          }
          
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(100, (elapsedTime / totalLoadTime) * 100);
          
          setProgressValue(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Finished - short delay before redirect
            setTimeout(() => {
              if (isMounted) {
                router.push('/');
              }
            }, 500);
          }
        }, 16); // Approximately 60fps for smooth animation
      }
    };
    
    // Start the sequence
    runSequence();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [router, messages]);

  // Skip button handler
  const handleSkip = () => {
    router.push('/');
  };

  // Inline style for the skip button
  const skipButtonStyle: CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 9999,
    backgroundColor: 'transparent',
    border: '1px solid #00ff41',
    color: '#00ff41',
    fontFamily: '"Courier New", monospace',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'none',
    top: 'auto',
    left: 'auto'
  };
  
  // Combined style with hover effect
  const buttonStyle: CSSProperties = {
    ...skipButtonStyle,
    ...(isHovered ? {
      backgroundColor: 'rgba(0, 255, 65, 0.2)',
      boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
    } : {})
  };

  return (
    <div className={styles.container}>
      {/* Scanlines and CRT effects */}
      <div className={styles.scanlines}></div>
      <div className={styles.crt}></div>
      
      {/* Terminal output */}
      <div className={styles.terminal}>
        <pre className={styles.terminalText}>
          {displayText}
          <span className={styles.cursor}></span>
        </pre>
      </div>
      
      {/* Progress bar */}
      {loadingStarted && (
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>System Initialization</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          <div className={styles.progressValue}>{progressValue.toFixed(1)}%</div>
          <div className={styles.progressMessage}>THE CONSTRUCT - COMING SOON</div>
        </div>
      )}
      
      {/* Skip button */}
      <button 
        onClick={handleSkip}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        WAKE UP
      </button>
    </div>
  );
}