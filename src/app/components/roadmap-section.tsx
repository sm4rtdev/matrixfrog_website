"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./roadmap.module.css";

export default function RoadmapSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [glitchingPhase, setGlitchingPhase] = useState<number | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const roadmapPhases = [
    {
      title: "FOUNDATION & LAUNCH",
      phase: "PHASE 1",
      period: "MAY - JUNE 2025",
      items: [
        "Launch token-gated 'Construct' section",
        "First comic-style video release",
        "Implement voting mechanism (red/blue choice)",
        "Establish fund distribution system",
        "Introduce 'Bloopers' section",
      ],
    },
    {
      title: "CONTENT EXPANSION",
      phase: "PHASE 2",
      period: "JULY - SEPTEMBER 2025",
      items: [
        "1-2 videos per month consistently",
        "Mini-game development starts",
        "Staking feature development",
        "Community feedback integration",
        "Expand interactive elements",
      ],
    },
    {
      title: "UTILITY DEPLOYMENT",
      phase: "PHASE 3",
      period: "OCTOBER - DECEMBER 2025",
      items: [
        "Launch mini-game with leaderboard",
        "Activate staking functionality",
        "Community rewards distribution",
        "Liquidity pools planning",
        "Year-end review & 2026 planning",
      ],
    },
  ];

  const keyFeatures = [
    {
      title: "CONSTRUCT PLATFORM",
      icon: "🖥️",
      description:
        "Token-gated interactive video platform with voting mechanics for 50k+ $MatrixFrog holders",
    },
    {
      title: "COMMUNITY VOTING",
      icon: "🗳️",
      description:
        "Direct the story by sending tokens to red/blue choice wallets - your votes shape the narrative",
    },
    {
      title: "BLOOPERS SECTION",
      icon: "🎬",
      description:
        "Exclusive behind-the-scenes content for engaged community members",
    },
    {
      title: "MINI-GAME & REWARDS",
      icon: "🎮",
      description:
        "Interactive game with leaderboard tracking and $MatrixFrog rewards for top performers",
    },
  ];

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionElement);
    return () => observer.unobserve(sectionElement);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let phase = 0;
    animationIntervalRef.current = setInterval(() => {
      if (phase < roadmapPhases.length) {
        setActivePhase(phase);
        setGlitchingPhase(phase);
        setTimeout(() => setGlitchingPhase(null), 500);
        phase++;
      } else {
        clearInterval(animationIntervalRef.current as NodeJS.Timeout);
      }
    }, 1000);

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isVisible, roadmapPhases.length]); // roadmapPhases.length als Abhängigkeit hinzugefügt

  const handlePhaseClick = (index: number) => {
    setActivePhase(index);
    setGlitchingPhase(index);
    setTimeout(() => setGlitchingPhase(null), 500);
  };

  return (
    <section id="roadmap" ref={sectionRef} className={styles.section}>
      {/* <div className={styles.absoluteInset}></div> */}
      <div className={styles.gridOverlay}></div>
      <div className={styles.codeRain}></div>

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.digitalInterference}></div>
          <h2 className={styles.headingTitle}>
            MATRIXFROG ROADMAP 2025
            <span className={styles.headerUnderline}></span>
          </h2>
          <p className={styles.headingDesc}>
            Our interactive journey to revolutionize community-driven
            storytelling
          </p>
        </div>

        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapLine}></div>

          <div className={styles.roadmapNodesWrapper}>
            <div className={styles.roadmapNodes}>
              {roadmapPhases.map((phase, index) => (
                <div
                  key={index}
                  className={`${styles.roadmapNode} ${index <= activePhase ? styles.active : ""
                    } ${glitchingPhase === index ? styles.glitching : ""}`}
                  onClick={() => handlePhaseClick(index)}
                >
                  <div className={styles.nodePulse}></div>
                  <div className={styles.nodeContent}>
                    <span className={styles.nodeLabel}>{phase.phase}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.roadmapDetails}>
            {roadmapPhases.map((phase, index) => (
              <div
                key={index}
                className={`${styles.roadmapPhaseCard} ${index <= activePhase ? styles.visible : ""
                  } ${glitchingPhase === index ? styles.glitching : ""}`}
              >
                <div className={styles.phaseHeader}>
                  <h3>{phase.title}</h3>
                  <div className={styles.phaseBadgeContainer}>
                    <span className={styles.phaseBadge}>{phase.phase}</span>
                    <span className={styles.phasePeriod}>{phase.period}</span>
                  </div>
                </div>
                <ul className={styles.phaseItems}>
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.phaseItem}>
                      <span className={styles.itemBullet}>▶</span>
                      <span className={styles.itemText}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.terminalHeaderContainer}>
            <h3 className={styles.terminalHeaderTitle}>
              <span className={styles.terminalTag}>&lt;</span> CORE FEATURES{" "}
              <span className={styles.terminalTag}>&gt;</span>
            </h3>
            <p className={styles.terminalHeaderDesc}>
              Interactive elements powering our ecosystem
            </p>
          </div>

          <div className={styles.mechanicsGrid}>
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className={`${styles.mechanicCard} ${isVisible ? styles.active : ""
                  }`}
                style={{ animationDelay: `${index * 0.15 + 1}s` }}
              >
                <div className={styles.mechanicIcon}>{feature.icon}</div>
                <h4 className={styles.mechanicTitle}>{feature.title}</h4>
                <p className={styles.mechanicDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.communityIncentives}>
          <div className={styles.incentivesTerminal}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalDots}>
                <span className={styles.terminalDot}></span>
                <span className={styles.terminalDot}></span>
                <span className={styles.terminalDot}></span>
              </div>
              <div className={styles.terminalTitle}>
                community@matrixfrog:~$ ./tokenomics.sh
              </div>
            </div>
            <div className={styles.terminalContent}>
              <h3 className={styles.incentivesTitle}>
                🚀 TOKEN UTILITY & VALUE
              </h3>
              <ul className={styles.incentivesList}>
                <li>
                  <span className={styles.incentivesBullet}>◉</span>{" "}
                  <strong>Access:</strong> 50k $MatrixFrog required for
                  Construct platform access
                </li>
                <li>
                  <span className={styles.incentivesBullet}>◉</span>{" "}
                  <strong>Voting Power:</strong> Tokens used to direct story
                  development
                </li>
                <li>
                  <span className={styles.incentivesBullet}>◉</span>{" "}
                  <strong>Staking:</strong> Earn rewards for long-term
                  participation
                </li>
                <li>
                  <span className={styles.incentivesBullet}>◉</span>{" "}
                  <strong>Exclusive Content:</strong> Unlock bloopers and
                  behind-the-scenes
                </li>
                <li>
                  <span className={styles.incentivesBullet}>◉</span>{" "}
                  <strong>Game Rewards:</strong> Compete in mini-games for token
                  prizes
                </li>
              </ul>
              <div className={styles.terminalPrompt}>
                <span className={styles.promptText}>
                  Ready to shape the MatrixFrog universe?
                </span>
                <span className={styles.cursorBlink}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
