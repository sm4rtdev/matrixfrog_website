"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';
import NavLink from './NavLink';
import './NavbarStyles.css';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Aktuelle Pfad-Information abrufen
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Verbesserte Funktion zur Erstellung korrekter Links
  const getNavLink = (anchor: string) => {
    if (isHomePage) {
      // Auf der Hauptseite verwenden wir Anker-Links
      return `#${anchor}`;
    } else {
      // Auf allen anderen Seiten verlinken wir zurück zur Hauptseite mit Anker
      return `/#${anchor}`;
    }
  };

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container" style={{ padding: 0, maxWidth: 'none' }}>
          <div className="nav-content">
            {/* Logo - aligned to the left */}
            <div className="logo-container" style={{ paddingLeft: '30px' }}>
              <Link href="/">
                <div className="glitch-text logo" data-text="MATRIXFROG">
                  MATRIXFROG
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - centered */}
            {!isMobile && (
              <div className="desktop-nav">
                <div className="nav-items">
                  <NavLink href={getNavLink("about")} label="About" />
                  <div className="divider">|</div>

                  <NavLink href={getNavLink("buybot")} label="BuyBot" />
                  <div className="divider">|</div>

                  <NavLink href="/migration-protocol" label="Treasury" />
                  <div className="divider">|</div>

                  <NavLink href="/construct" label="Construct" />
                  <div className="divider">|</div>

                  <NavLink href={getNavLink("roadmap")} label="Roadmap" />
                </div>
              </div>
            )}

            {/* Right section - social icons or mobile menu button */}
            <div className="right-section" style={{ paddingRight: '50px', gap: '15px' }}>
              {!isMobile ? (
                <>
                  {/* Wrapper für Social-Media-Icons mit mehr Abstand nach rechts */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Telegram */}
                    <a href="https://t.me/MatrixFrogPepu" className="social-button hover-white" aria-label="Telegram"
                      style={{ width: '32px', height: '32px', background: 'transparent', border: 'none' }}>
                      <div className="social-icon" style={{ padding: 0 }}>
                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      </div>
                    </a>

                    {/* X (formerly Twitter) */}
                    <a href="https://x.com/Matrixfrog_" className="social-button hover-white" aria-label="X"
                      style={{ width: '32px', height: '32px', background: 'transparent', border: 'none' }}>
                      <div className="social-icon" style={{ padding: 0 }}>
                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      </div>
                    </a>

                    {/* Discord */}
                    <a href="https://discord.gg/CM2AfcfmCU" className="social-button hover-white" aria-label="Discord"
                      style={{ width: '32px', height: '32px', background: 'transparent', border: 'none' }}>
                      <div className="social-icon" style={{ padding: 0 }}>
                        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      </div>
                    </a>
                  </div>

                  {/* Wallet Connect mit etwas Abstand zu den Social-Icons */}
                  <div className="wallet-button" style={{ marginLeft: '15px' }}>
                    <svg className="social-icon" style={{ marginRight: '6px' }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                    Wallet Connect
                  </div>
                </>
              ) : (
                <button
                  onClick={toggleMenu}
                  className="hamburger-button hover-white"
                  aria-label="Toggle menu"
                >
                  <div className="hamburger-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && menuOpen && (
            <MobileMenu
              getNavLink={getNavLink}
              setMenuOpen={setMenuOpen}
            />
          )}
        </div>
      </nav>
    </>
  );
}