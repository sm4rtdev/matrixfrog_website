// app/components/MatrixInfoTabs.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

export default function MatrixInfoTabs() {
  // const [activeTab, setActiveTab] = useState('main');
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [, setShowScrollHint] = useState(false);

  // Animation for page load
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Check if tabs are scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowScrollHint(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, []);

  return (
    <div className={`matrix-container ${pageLoaded ? 'visible' : ''}`}>
      {/* Introduction */}
      <div className="matrix-intro">
        <p>
          {/* Dear MatrixFrog Community, */}
        </p>
        <p>
          This MatrixFrog community wallet is the key to our collective success and growth. By centralizing our resources, we unlock the potential to:
        </p>
        <p>
          Create a Thriving Ecosystem: Robust liquidity for MatrixFrog.
        </p>
        <p className="matrix-team">
          Expand Our Reach: Effective marketing to bring new minds into the Matrix.
        </p>
        <p>
          Ensure Smooth Operations: Seamlessly cover necessary project expenses.
        </p>
        <p>
          Reward Our Agents: Exciting giveaways and community engagement programs.
        </p>
        <p>
          Innovate and Evolve: Providing the foundational liquidity for our own unique future coin.
        </p>
        <p>
          The choice is yours. The future is ours to build.
        </p>
      </div>

      {/* Tab Navigation with Scroll Hint */}
      {/* <div className="matrix-tabs-wrapper">
        <div className="matrix-tabs" ref={tabsContainerRef}>
          <div
            className={`matrix-tab ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            Main Info
          </div>
          <div
            className={`matrix-tab ${activeTab === 'promise' ? 'active' : ''}`}
            onClick={() => setActiveTab('promise')}
          >
            Our Promise
          </div>
          <div
            className={`matrix-tab ${activeTab === 'benefits' ? 'active' : ''}`}
            onClick={() => setActiveTab('benefits')}
          >
            Benefits
          </div>
          <div
            className={`matrix-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </div>
          <div
            className={`matrix-tab ${activeTab === 'transparency' ? 'active' : ''}`}
            onClick={() => setActiveTab('transparency')}
          >
            Transparency
          </div>
        </div>
        {showScrollHint && (
          <div className="scroll-hint">
            <div className="scroll-hint-arrow">&gt;</div>
          </div>
        )}

        <div className="matrix-dots">
          <div className={`matrix-dot ${activeTab === 'main' ? 'active' : ''}`}></div>
          <div className={`matrix-dot ${activeTab === 'promise' ? 'active' : ''}`}></div>
          <div className={`matrix-dot ${activeTab === 'benefits' ? 'active' : ''}`}></div>
          <div className={`matrix-dot ${activeTab === 'timeline' ? 'active' : ''}`}></div>
          <div className={`matrix-dot ${activeTab === 'transparency' ? 'active' : ''}`}></div>
        </div>
      </div> */}

      {/* Tab Content */}
      {/* <div className="matrix-content">
        
        <div className={`matrix-panel ${activeTab === 'main' ? 'active' : ''}`}>
          <h3>What&apos;s Happening</h3>
          <ul>
            <li>PEPU is migrating to Arbitrum chain for improved stability and features</li>
            <li>We&apos;re fully supporting this move and creating a new MatrixFrog token on Arbitrum</li>
            <li>MatrixFrog remains a key part of the PEPU ecosystem</li>
            <li>Deadline for deposits: May 16, 2025 or when 500 million MatrixFrog has been supplied</li>
          </ul>
        </div>

        
        <div className={`matrix-panel ${activeTab === 'promise' ? 'active' : ''}`}>
          <h3>Our Promise to You</h3>
          <ul>
            <li>If token migration is possible: Everyone will receive the SAME NUMBER of tokens on the new chain automatically</li>
            <li>If migration is not possible: Everyone who has sent MatrixFrog tokens to the community wallet will receive the SAME NUMBER of tokens in the new MatrixFrog</li>
            <li>Anyone who prefers not to participate in this migration can request their original tokens back before the deadline</li>
            <li>All transactions are being meticulously tracked</li>
            <li>The new token will launch with stronger liquidity and development support</li>
          </ul>
        </div>

        
        <div className={`matrix-panel ${activeTab === 'benefits' ? 'active' : ''}`}>
          <h3>What This Means For You</h3>
          <ul>
            <li>You don&apos;t lose your investment despite the infrastructure changes</li>
            <li>You maintain your position in the project</li>
            <li>You get early entrance to the new MatrixFrog token before public launch</li>
            <li>The new MatrixFrog has potential for higher market cap than before</li>
          </ul>
        </div>

        
        <div className={`matrix-panel ${activeTab === 'timeline' ? 'active' : ''}`}>
          <h3>Timeline</h3>
          <ul>
            <li>Deposit deadline: <span className="matrix-highlight">May 16, 2025, 23:59 UTC or when 500 Million MatrixFrog has been deposited</span></li>
            <li>New token launch: To be announced (dependent on PEPU&apos;s migration timeline)</li>
            <li>Token distribution: Within 48 hours of launch</li>
          </ul>
        </div>

        
        <div className={`matrix-panel ${activeTab === 'transparency' ? 'active' : ''}`}>
          <h3>Transparency</h3>
          <ul>
            <li>A portion of the initial token supply will be used to return all community deposits</li>
            <li>Remaining tokens will be allocated for:
              <ul>
                <li>Development and tech support</li>
                <li>Marketing initiatives</li>
                <li>Liquidity provision</li>
                <li>Project reserve fund</li>
              </ul>
            </li>
            <li>All wallet transactions are public and can be tracked for complete transparency</li>
            <li>We will continue using the MatrixFrog Community Wallet after migration for team growth and development</li>
            <li>More detailed information on this will come within the next week</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
}