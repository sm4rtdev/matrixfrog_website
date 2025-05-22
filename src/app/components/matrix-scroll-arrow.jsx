// matrix-scroll-arrow.jsx
import { useState, useEffect } from 'react';

export default function MatrixScrollArrow() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Initial delay - arrow appears after 2.5 seconds
    const initialDelay = setTimeout(() => {
      setVisible(true);
    }, 2500);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Hide arrow after user has scrolled beyond a threshold (50px)
      if (scrollPosition > 50) {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialDelay);
    };
  }, []);
  
  return (
    <div 
      className={`matrix-scroll-arrow ${!visible ? 'arrow-hidden' : ''}`}
      onClick={() => {
        // Smooth scroll to about section when clicked
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      <div className="arrow-container">
        <div className="matrix-arrow">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-svg"
          >
            <path 
              d="M12 5V19M12 19L19 12M12 19L5 12" 
              stroke="rgba(0, 255, 65, 1)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="matrix-text">SCROLL DOWN</div>
      </div>
    </div>
  );
}