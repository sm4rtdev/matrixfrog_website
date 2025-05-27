// app/migration-protocol/components/MigrationProtocolClient.tsx
"use client";

import { useRef, useEffect } from "react";
import Navbar from "../../components/navbar";
import WalletTracker from "./WalletTracker";
import Footer from "../../components/footer";
import MatrixInfoTabs from "./MatrixInfoTabs";
import "./styles.css";

export default function MigrationProtocolClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const characters = "PEPATROXM10フロッグカエル0123456789";
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * -100);

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 255, 65, 0.75)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.4) {
          const char = characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        }
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98)
          drops[i] = 0;
        drops[i] += 0.9;
      }
    };

    const interval = setInterval(draw, 40);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .bg-crt {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.1) 50%
          );
          background-size: 100% 2px;
        }
        .bg-scanlines {
          background-image: linear-gradient(
            transparent 0%,
            rgba(0, 255, 65, 0.05) 50%,
            transparent 100%
          );
        }
        .vignette {
          box-shadow: 0 0 150px rgba(0, 0, 0, 0.7) inset;
          opacity: 0.5;
        }
      `}</style>

      <main className="flex min-h-screen flex-col items-center justify-between relative overflow-x-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full z-0"
        />
        <div className="fixed inset-0 bg-scanlines z-10 pointer-events-none"></div>
        <div className="fixed inset-0 bg-crt z-10 pointer-events-none"></div>
        <div className="fixed inset-0 vignette z-10 pointer-events-none"></div>

        <Navbar />
        <div className="w-full z-20">
          <div className="h-[80px]"></div>
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="w-full text-center mb-6">
              <h1 className="text-matrix-green text-3xl md:text-4xl font-bold">
                MatrixFrog Treasury
              </h1>
            </div>
            <MatrixInfoTabs />
            <WalletTracker />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
