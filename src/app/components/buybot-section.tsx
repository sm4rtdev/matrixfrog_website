"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function BuyBotSection() {
  // State für den aktiven Tab
  const [activeTab, setActiveTab] = useState<
    "what" | "how" | "why" | "command"
  >("what");
  // State für den aktiven Slider-Index
  const [activeSlide, setActiveSlide] = useState(0);
  // Referenzen für die Typed-Animation
  const typingRef = useRef<HTMLSpanElement>(null);
  const [typedText, setTypedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Slider-Bilder mit den tatsächlichen Pfaden
  const sliderImages = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];

  // Typing-Animation-Effekt
  useEffect(() => {
    const textToType = "MatrixFrog BUYBOT: REAL-TIME MONITORING";
    if (currentCharIndex < textToType.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + textToType[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, typedText]);

  // Auto-Slider für Bilder
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Funktion zum manuellen Wechseln der Slides
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  // Funktion für den nächsten Slide
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliderImages.length);
  };

  // Funktion für den vorherigen Slide
  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  // Content für jeden Tab
  const tabContents = {
    what: (
      <div className="terminal-text-container">
        <h3 className="text-matrix-green font-bold text-xl mb-4">
          What Is the $MatrixFrog BuyBot?
        </h3>
        <p className="text-white leading-relaxed mb-4">
          The $MatrixFrog BuyBot is a customizable Telegram bot designed to
          display and monitor transaction on the blockchain in real time. The
          end user can customize the bot as they see fit to enhance
          transparency, as well as building excitment by displaying data-rich
          notifications directly to the communities chat.
        </p>
        <p className="text-white leading-relaxed">
          It not only enhances transparency but also builds excitement by
          delivering engaging, data-rich notifications directly to your chat.
        </p>
      </div>
    ),
    how: (
      <div className="terminal-text-container">
        <h3 className="text-matrix-green font-bold text-xl mb-4">
          How Does It Work?
        </h3>

        <h4 className="text-white font-bold mb-2">
          Real-Time Blockchain Monitoring:
        </h4>
        <p className="text-white leading-relaxed mb-4">
          The BuyBot connects to the Pepe Unchained network using its dedicated
          RPC endpoint. It continuously listens for blockchain log events
          associated with $MATRIX, filtering out only the genuine buy
          transactions.
        </p>

        <h4 className="text-white font-bold mb-2">
          Event Processing and Verification:
        </h4>
        <p className="text-white leading-relaxed mb-4">
          Utilizing the Ethereum Go client libraries, the BuyBot inspects each
          log entry to ensure it represents a valid purchase. It verifies that
          tokens are transferred from the liquidity pool (and not as internal
          transfers) before triggering an alert.
        </p>

        <h4 className="text-white font-bold mb-2">
          Data Integration & Calculation:
        </h4>
        <p className="text-white leading-relaxed mb-4">
          The bot pulls live token data from GeckoTerminal to compute essential
          metrics, such as:
        </p>
        <ul className="list-disc pl-6 text-white mb-4">
          <li>Token Price</li>
          <li>Market Cap</li>
          <li>Buy Value in USD</li>
        </ul>
        <p className="text-white leading-relaxed">
          These calculations ensure that each alert is not only timely but also
          informative, giving community members a clear picture of each buy
          event&apos;s market impact.
        </p>
      </div>
    ),
    why: (
      <div className="terminal-text-container">
        <h3 className="text-matrix-green font-bold text-xl mb-4">
          Why Use the $MatrixFrog BuyBot?
        </h3>
        <p className="text-white leading-relaxed mb-4">
          The BuyBot is a cornerstone of $MATRIX&apos;s commitment to utility
          and community engagement. It provides:
        </p>
        <ul className="space-y-3 text-white mb-4">
          <li className="flex items-start">
            <span className="text-matrix-green mr-2">→</span>
            <span>
              <strong>Immediate Transparency:</strong> Community members receive
              instant updates on significant buy events, fostering a
              well-informed user base.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-matrix-green mr-2">→</span>
            <span>
              <strong>Enhanced Engagement:</strong> Visual and detailed alerts
              spark discussion and excitement, reinforcing $MatrixFrog as a
              dynamic project.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-matrix-green mr-2">→</span>
            <span>
              <strong>Reliability and Efficiency:</strong> Built with robust Go
              code and proven libraries, the BuyBot ensures consistent
              performance even during high-volume trading periods.
            </span>
          </li>
        </ul>
        <p className="text-white leading-relaxed">
          By combining real-time monitoring, detailed analytics, and engaging
          visual cues, the $MatrixFrog BuyBot isn&apos;t just a notification
          tool—it&apos;s an essential part of the community&apos;s strategy to
          break out of the matrix, much like NEO did, and build a vibrant,
          innovative future for Pepe Unchained.
        </p>
      </div>
    ),
    command: (
      <div className="terminal-text-container command-list">
        <h3 className="text-matrix-green font-bold text-xl mb-4">
          How to Use PepuBuyBot (The $MatrixFrog BuyBot)
        </h3>
        <p className="text-white leading-relaxed mb-4">
          PepuBuyBot is our custom Telegram bot that monitors $MatrixFrog buy
          events in real time on the Pepe Unchained network. It sends engaging,
          emoji-powered alerts to keep you instantly informed about every
          transaction.
        </p>

        <div className="command-terminal">
          <div className="command">
            <span className="command-text">/help</span>
            <p className="command-desc">
              Shows a list of all available commands and a brief description of
              each.
            </p>
          </div>

          <div className="command">
            <span className="command-text">
              /setup &lt;tokenEmoji&gt; &lt;contractAddr&gt; &lt;poolAddr&gt;
              [buyValueLimit=0] [emojiRatio=10000] [maxEmojiRows=12]
            </span>
            <p className="command-desc">
              Initializes the bot with your configuration settings.
            </p>
            <div className="command-example">
              <p>
                <strong>Example:</strong> /setup 🐸 0x1234567890abcdef
                0xabcdef1234567890 25 50000 12
              </p>
            </div>
          </div>

          <div className="command">
            <span className="command-text">/start</span>
            <p className="command-desc">
              Starts or resumes monitoring based on your current configuration.
            </p>
          </div>

          <div className="command">
            <span className="command-text">/stop</span>
            <p className="command-desc">
              Stops monitoring (your configuration is preserved so you can
              resume with /start later).
            </p>
          </div>

          <div className="command">
            <span className="command-text">/reset</span>
            <p className="command-desc">
              Deletes the current configuration and stops monitoring, allowing
              you to set up the bot afresh.
            </p>
          </div>

          <div className="command">
            <span className="command-text">/setemoji &lt;emoji&gt;</span>
            <p className="command-desc">
              Updates the token emoji used in alerts.
            </p>
            <div className="command-example">
              <p>
                <strong>Example:</strong> /setemoji 🐸
              </p>
            </div>
          </div>

          <div className="command">
            <span className="command-text">/setlimit &lt;amount&gt;</span>
            <p className="command-desc">
              Sets or updates the minimum USD buy limit required to trigger an
              alert.
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <section
      id="buybot"
      className="w-full min-h-screen py-16 md:py-24 flex items-center justify-center relative overflow-hidden"
    >
      {/* Hintergrund-Effekt */}
      <div className="absolute inset-0 bg-black bg-opacity-90 z-10"></div>

      <div className="buybot-grid-noise"></div>
      <div className="buybot-grid-lines"></div>

      <div className="max-w-6xl w-full mx-auto px-4 relative z-20">
        {/* Überschrift mit Typing-Effekt */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="typing-effect" ref={typingRef}>
              {typedText}
            </span>
            <span className="typing-cursor">|</span>
          </h2>
        </div>

        {/* Terminal mit Tabs für verschiedene Informationen */}
        <div className="terminal-frame info-container mb-12">
          <div className="terminal-header">
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <span className="terminal-dot"></span>
            <div className="terminal-tabs">
              <button
                onClick={() => setActiveTab("what")}
                className={`terminal-tab ${activeTab === "what" ? "active" : ""
                  }`}
              >
                WHAT
              </button>
              <button
                onClick={() => setActiveTab("how")}
                className={`terminal-tab ${activeTab === "how" ? "active" : ""
                  }`}
              >
                HOW
              </button>
              <button
                onClick={() => setActiveTab("why")}
                className={`terminal-tab ${activeTab === "why" ? "active" : ""
                  }`}
              >
                WHY
              </button>
              <button
                onClick={() => setActiveTab("command")}
                className={`terminal-tab ${activeTab === "command" ? "active" : ""
                  }`}
              >
                COMMANDS
              </button>
            </div>
          </div>

          <div className="terminal-content">{tabContents[activeTab]}</div>
        </div>

        {/* Neuer Slider unter den Tabs */}
        <div className="matrix-slider-container">
          <div className="matrix-slider-header">
            <h3 className="text-matrix-green font-bold text-xl">
              BuyBot Notifications
            </h3>
            <p className="text-white opacity-70">
              Real examples from other Telegram channels
            </p>
          </div>

          <div className="matrix-slider-content">
            <button
              className="matrix-slider-control prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <span>&#10094;</span>
            </button>

            <div className="matrix-slider-outer">
              <div className="matrix-slider-wrapper">
                {sliderImages.map((img, index) => (
                  <div
                    key={index}
                    className={`matrix-slide ${activeSlide === index ? "active" : ""
                      }`}
                  >
                    <div className="matrix-slide-frame">
                      <Image
                        src={img}
                        alt={`BuyBot Example ${index + 1}`}
                        width={253}
                        height={450}
                        className="matrix-slide-image"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="matrix-slider-control next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <span>&#10095;</span>
            </button>
          </div>

          <div className="matrix-slider-indicators">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`matrix-indicator ${activeSlide === index ? "active" : ""
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS für spezielle Effekte */}
      <style jsx>{`
        .buybot-grid-noise {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.05;
          z-index: 11;
          pointer-events: none;
        }

        .buybot-grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: linear-gradient(
              to right,
              rgba(0, 255, 65, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(0, 255, 65, 0.1) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          z-index: 12;
          pointer-events: none;
        }

        .typing-effect {
          color: var(--matrix-green, #00ff41);
          font-family: "Courier New", monospace;
        }

        .typing-cursor {
          color: var(--matrix-green, #00ff41);
          font-weight: bold;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from,
          to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .terminal-frame {
          background-color: rgba(0, 10, 0, 0.85);
          border: 1px solid rgba(0, 255, 65, 0.5);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.7),
            0 0 30px rgba(0, 255, 65, 0.2);
          display: flex;
          flex-direction: column;
        }

        .terminal-header {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: rgba(0, 20, 0, 0.8);
          border-bottom: 1px solid rgba(0, 255, 65, 0.3);
        }

        .terminal-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 6px;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .terminal-dot:nth-child(1) {
          background-color: rgba(255, 95, 87, 0.8);
        }

        .terminal-dot:nth-child(2) {
          background-color: rgba(255, 189, 46, 0.8);
        }

        .terminal-dot:nth-child(3) {
          background-color: rgba(39, 201, 63, 0.8);
        }

        .terminal-tabs {
          display: flex;
          margin-left: auto;
        }

        .terminal-tab {
          padding: 4px 12px;
          margin: 0 2px;
          background-color: rgba(0, 30, 0, 0.4);
          border: 1px solid rgba(0, 255, 65, 0.2);
          border-bottom: none;
          border-radius: 4px 4px 0 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .terminal-tab:hover {
          background-color: rgba(0, 40, 0, 0.6);
          color: rgba(255, 255, 255, 0.8);
        }

        .terminal-tab.active {
          background-color: rgba(0, 255, 65, 0.15);
          color: var(--matrix-green, #00ff41);
          border-color: rgba(0, 255, 65, 0.4);
        }

        .terminal-content {
          padding: 20px;
          overflow-y: auto;
          max-height: 500px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 255, 65, 0.5) rgba(0, 20, 0, 0.4);
        }

        .terminal-content::-webkit-scrollbar {
          width: 6px;
        }

        .terminal-content::-webkit-scrollbar-track {
          background: rgba(0, 20, 0, 0.4);
        }

        .terminal-content::-webkit-scrollbar-thumb {
          background-color: rgba(0, 255, 65, 0.5);
          border-radius: 3px;
        }

        .terminal-text-container {
          font-family: "Courier New", monospace;
          line-height: 1.7;
        }

        .command-list .command {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0, 255, 65, 0.2);
        }

        .command-text {
          display: block;
          padding: 6px 12px;
          background-color: rgba(0, 0, 0, 0.4);
          border-left: 3px solid var(--matrix-green, #00ff41);
          color: var(--matrix-green, #00ff41);
          font-weight: bold;
          margin-bottom: 8px;
          overflow-x: auto;
          white-space: nowrap;
        }

        .command-desc {
          color: rgba(255, 255, 255, 0.8);
          padding-left: 15px;
        }

        .command-example {
          margin-top: 8px;
          padding: 8px 15px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .command-example strong {
          color: var(--matrix-green, #00ff41);
        }

        .command-terminal {
          background-color: rgba(0, 0, 0, 0.3);
          padding: 15px;
          border-radius: 6px;
          border: 1px solid rgba(0, 255, 65, 0.2);
        }

        /* Neuer Matrix-Slider Stil */
        .matrix-slider-container {
          background-color: rgba(0, 10, 0, 0.85);
          border: 1px solid rgba(0, 255, 65, 0.5);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.7),
            0 0 30px rgba(0, 255, 65, 0.2);
          padding: 20px 0;
        }

        .matrix-slider-header {
          text-align: center;
          margin-bottom: 20px;
          padding: 0 20px;
        }

        .matrix-slider-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          max-width: 400px;
        }

        .matrix-slider-outer {
          position: relative;
          width: 265px;
          height: 468px;
          overflow: visible;
          padding: 6px;
          margin: 0 auto;
        }

        .matrix-slider-wrapper {
          position: relative;
          width: 253px;
          height: 456px;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          padding: 3px;
        }

        .matrix-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.5s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
        }

        .matrix-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        .matrix-slide-frame {
          border: 3px solid rgba(0, 255, 65, 0.5);
          border-radius: 12px;
          padding: 3px;
          background-color: rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
          overflow: visible;
          height: 450px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .matrix-slide-image {
          max-height: 100%;
          width: auto;
          object-fit: scale-down;
          border-radius: 8px;
          max-width: 100%;
        }

        .matrix-slider-control {
          background-color: rgba(0, 0, 0, 0.6);
          color: rgba(0, 255, 65, 0.8);
          border: 1px solid rgba(0, 255, 65, 0.3);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .matrix-slider-control:hover {
          background-color: rgba(0, 20, 0, 0.8);
          color: var(--matrix-green, #00ff41);
          border-color: rgba(0, 255, 65, 0.8);
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }

        .matrix-slider-control.prev {
          left: -20px;
        }

        .matrix-slider-control.next {
          right: -20px;
        }

        .matrix-slider-indicators {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 10px;
        }

        .matrix-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(0, 255, 65, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .matrix-indicator.active {
          background-color: var(--matrix-green, #00ff41);
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
        }

        @media (max-width: 768px) {
          .terminal-tab {
            font-size: 0.7rem;
            padding: 3px 8px;
          }

          .matrix-slider-outer {
            width: 237px;
            height: 418px;
          }

          .matrix-slider-wrapper {
            width: 225px;
            height: 406px;
          }

          .matrix-slide-frame {
            height: 400px;
          }

          .matrix-slider-control {
            width: 30px;
            height: 30px;
            font-size: 1rem;
          }

          .matrix-slider-control.prev {
            left: -15px;
          }

          .matrix-slider-control.next {
            right: -15px;
          }

          .matrix-slider-content {
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}
