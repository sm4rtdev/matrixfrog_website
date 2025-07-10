"use client";

import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useAccount } from "wagmi";
import styles from "./construct.module.css";

export default function ConstructPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [isHovered, setIsHovered] = useState(false);
  const [firstText, setFirstText] = useState(true);
  const [secondText, setSecondText] = useState(false);
  const [matrixBalance, setMatrixBalance] = useState<string | null>(null);

  useEffect(() => {
    const bal = window.localStorage.getItem("Mat_bal");
    setMatrixBalance(bal || null);
  }, []);

  // Check wallet connection
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (!isConnected) return; // Don't proceed if not connected

    const timers: NodeJS.Timeout[] = [];

    // Step 1: Show "Standard Access..." message for 2 seconds
    setFirstText(true);
    timers.push(
      setTimeout(() => {
        setFirstText(false);
        setSecondText(true);

        // Step 2: Show "VIP confirmed..." message for 2 seconds
        timers.push(
          setTimeout(() => {
            setSecondText(false);
            router.push("/construct/dashboard");
          }, 1000)
        );
      }, 2000)
    );

    // Cleanup: Clear all timers when component unmounts
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [router, isConnected]); // Include isConnected in dependencies

  // Handle skip button click
  const handleSkip = () => {
    router.push("/construct/dashboard");
  };

  // Inline style for the skip button
  const skipButtonStyle: CSSProperties = {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: 9999,
    backgroundColor: "transparent",
    border: "1px solid #00ff41",
    color: "#00ff41",
    fontFamily: '"Courier New", monospace',
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: "none",
    top: "auto",
    left: "auto",
  };

  // Combined style with hover effect
  const buttonStyle: CSSProperties = {
    ...skipButtonStyle,
    ...(isHovered
      ? {
        backgroundColor: "rgba(0, 255, 65, 0.2)",
        boxShadow: "0 0 10px rgba(0, 255, 65, 0.5)",
      }
      : {}),
  };

  return (
    <div className={styles.container}>
      {/* Terminal output */}
      <div className={styles.terminal}>
        <pre className={styles.terminalText}></pre>
      </div>

      <div className={styles.progressContainer}>
        <div style={{ fontSize: "2rem" }} className={styles.progressMessage}>
          LOADING THE CONSTRUCT...
        </div>
        <div className={styles.tokenBalance}>
          MatrixFrog Token Balance: {matrixBalance ?? "0"}
        </div>
        {firstText && (
          <div className={styles.tokenMessage}>
            Standard-Access 10000.00 additional tokens required for VIP status
          </div>
        )}
        {secondText && (
          <div className={styles.tokenMessage}>
            VIP-Status confirmed <IoMdCheckmark />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "3rem",
          }}
        >
          <div className={styles.dot} />
          <div className={styles.dot2} />
          <div className={styles.dot3} />
        </div>
      </div>

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
