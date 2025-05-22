"use client";

import { useEffect, useState, useMemo, CSSProperties } from 'react';

export default function InitialPage({ onComplete }: { onComplete: () => void }) {
  // State für den aktuellen Text
  const [displayText, setDisplayText] = useState("");
  // State für den Ladebalken
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  // Nur noch ein Text, der getippt werden soll
  const messages = useMemo(() => ["Knock, knock, fren"], []);
  
  // Haupteffekt für die Animationssequenz
  useEffect(() => {
    let isMounted = true;
    
    // Funktion für das Tippen eines einzelnen Textes
    const typeMessage = async (text: string, delay: number = 100) => {
      if (!isMounted) return;
      
      // Text zurücksetzen beim Start einer neuen Nachricht
      setDisplayText("");
      
      // Jeden Buchstaben einzeln tippen
      for (let i = 0; i < text.length; i++) {
        if (!isMounted) return;
        
        await new Promise(resolve => 
          setTimeout(resolve, delay + Math.random() * 50)
        );
        
        if (isMounted) {
          setDisplayText(prev => prev + text[i]);
        }
      }
    };
    
    // Funktion für den kompletten Ablauf
    const runSequence = async () => {
      // Warte vor dem Start
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Nur noch eine Nachricht
      await typeMessage(messages[0]);
      
      // Pause nach der Nachricht
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Starte den Ladebalken mit realistischer Zeitberechnung
      if (isMounted) {
        setIsLoading(true);
        
        // Gesamtdauer für den Ladevorgang (in Millisekunden)
        const totalLoadTime = 3000; // 3 Sekunden Gesamtladezeit
        const startTime = Date.now();
        
        // Fortschritt basierend auf der tatsächlichen Zeit berechnen
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
            
            // Fertig - kurze Verzögerung nach Abschluss
            setTimeout(() => {
              if (isMounted) {
                onComplete();
              }
            }, 300); // Kurze Endverzögerung
          }
        }, 16); // Ungefähr 60fps für flüssige Animation
      }
    };
    
    // Starte die Sequenz
    runSequence();
    
    // Cleanup-Funktion
    return () => {
      isMounted = false;
    };
  }, [messages, onComplete]);

  // Skip-Button Handler
  const handleSkip = () => {
    onComplete();
  };

  // Inline-Style für den Skip-Button, der alle anderen CSS-Regeln überschreibt
  const skipButtonStyle: CSSProperties = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 9999,
    backgroundColor: 'transparent',
    border: '1px solid var(--matrix-green, #00ff41)',
    color: 'var(--matrix-green, #00ff41)',
    fontFamily: '"Courier New", monospace',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'none',
    top: 'auto',
    left: 'auto'
  };

  // Hover-Style als separater Zustand
  const [isHovered, setIsHovered] = useState(false);
  
  // Kombinierter Stil mit Hover-Effekt
  const buttonStyle: CSSProperties = {
    ...skipButtonStyle,
    ...(isHovered ? {
      backgroundColor: 'rgba(0, 255, 65, 0.2)',
      boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
    } : {})
  };

  // Keyframes für fadeIn-Animation
  const fadeInKeyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  // Styles für den verbesserten Ladebalken - KORRIGIERT
  const progressContainerStyle: CSSProperties = {
    position: 'fixed', // Änderung von 'absolute' zu 'fixed'
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '450px',
    textAlign: 'center',
    zIndex: 20,
    opacity: 1, // Setze Opacity direkt auf 1, statt mit Animation
    margin: 0, // Stelle sicher, dass kein Margin vorhanden ist
    padding: 0 // Stelle sicher, dass kein Padding vorhanden ist
  };

  const progressLabelStyle: CSSProperties = {
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--matrix-green, #00ff41)'
  };

  const progressBarStyle: CSSProperties = {
    width: '100%',
    height: '4px',
    backgroundColor: '#003b09',
    border: '1px solid var(--matrix-green, #00ff41)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)'
  };

  const progressFillStyle: CSSProperties = {
    height: '100%',
    backgroundColor: 'var(--matrix-green, #00ff41)',
    borderRadius: '1px',
    transition: 'width 0.1s linear'
  };

  const progressValueStyle: CSSProperties = {
    textAlign: 'right',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    color: 'var(--matrix-green, #00ff41)'
  };

  return (
    <div className="fixed inset-0 z-30 bg-black overflow-hidden w-full h-full">
      {/* Inline-CSS für fadeIn-Animation */}
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />
      
      {/* Scanlines and CRT effects */}
      <div className="bg-scanlines"></div>
      <div className="bg-crt"></div>
      
      {/* Chat terminal in top left - ohne Border */}
      <div className="absolute top-8 left-8 w-80 md:w-96 z-20 animate-fadeIn">
        <div className="p-4 bg-transparent">
          <div className="font-mono text-matrix-green text-sm leading-relaxed">
            <div className="mb-3 chat-message">
              {displayText}
              <span className="terminal-cursor ml-1"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Verbesserter Progress bar - in der Mitte des Bildschirms */}
      {isLoading && (
        <div style={progressContainerStyle}>
          <div style={progressLabelStyle}>Initializing system...</div>
          <div style={progressBarStyle}>
            <div 
              style={{
                ...progressFillStyle,
                width: `${progressValue}%`
              }}
            ></div>
          </div>
          <div style={progressValueStyle}>{progressValue.toFixed(1)}%</div>
        </div>
      )}
      
      {/* Skip-Button mit Inline-Style und ohne Klassen, die Konflikte verursachen könnten */}
      <button 
        onClick={handleSkip}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        SKIP
      </button>
    </div>
  );
}