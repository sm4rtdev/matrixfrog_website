"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import InitialPage from "./initial-page";
import Navbar from "./components/navbar";
import AboutSection from "./components/about-section";
import BuyBotSection from "./components/buybot-section";
import RoadmapSection from "./components/roadmap-section";
import Footer from "./components/footer";
import MatrixScrollArrow from "./components/matrix-scroll-arrow";
import "./home-styles.css";

export default function Home() {
  // InitialPage nur beim ersten Besuch anzeigen mit localStorage
  const [loading, setLoading] = useState(true);

  // Nach dem ersten Rendering die localStorage-Prüfung durchführen
  useEffect(() => {
    // Prüfen, ob der Benutzer die Seite bereits besucht hat
    const hasVisited = localStorage.getItem("hasSeenInitialPage") === "true";
    if (hasVisited) {
      setLoading(false); // Kein Loading anzeigen, wenn bereits besucht
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [typedText, setTypedText] = useState<string>("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textComplete, setTextComplete] = useState(false);

  // Pill-Effekt Zustände
  const [pillFlashEffect, setPillFlashEffect] = useState<
    "none" | "red" | "blue"
  >("none");

  // Zitat-Zustand mit verbessertem Übergang
  const [matrixQuote, setMatrixQuote] = useState<string | null>(null);
  const [displayedQuote, setDisplayedQuote] = useState<string>("");
  const [quoteTransition, setQuoteTransition] = useState<
    "idle" | "fadeOut" | "typing"
  >("idle");

  const textToType = useMemo(
    () => [
      "Human or Frog? Reality or Simulation?",
      "A new collaboration that will change the crypto universe forever.",
    ],
    []
  );

  // Matrix-Zitate - Original und neue philosophische Zitate kombiniert
  const redPillQuotes = [
    // Original MatrixFrog Zitate
    "What is real? How do you define real? If you're talking about what you can feel, what you can smell, what you can taste and see, then real is simply electrical signals interpreted by your brain.",
    "I'm trying to free your mind, Fren. But I can only show you the door. You're the one that has to walk through it.",
    "The MatrixFrog is the world that has been pulled over your eyes to blind you from the truth.",
    "You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes.",
    "Free your mind.",

    // Neue
    "The path to enlightenment is paved with uncomfortable truths; yet each revelation brings us closer to authentic existence.",
    "When the veil is lifted, we may find both wonder and shadow. True awakening means accepting both.",
    "Knowledge may bear a heavy burden, but it grants the freedom to shape one's own reality.",
    "To see the invisible strings that move the world is not the end of wonder, but its beginning.",
    "Truth seekers walk a lonely path first, but eventually find companions who share the same vision.",
  ];

  const bluePillQuotes = [
    // Original MatrixFrog Zitate
    "Ignorance is bliss.",
    "You take the blue pill, the story ends, you wake up in your bed and believe whatever you want to believe.",
    "The MatrixFrog is a system, Fren. That system is our enemy.",
    "You've been living in a dream world, Fren.",
    "Remember, all I'm offering is the truth. Nothing more.",

    // Neue
    "In the garden of structured illusions, one may still find genuine joy and meaningful connection.",
    "Sometimes the dream holds wisdom that raw reality cannot express; the symbols speak when facts fall silent.",
    "The architect of one's own reality finds peace in the structures they choose to accept.",
    "To embrace the narrative is not weakness - it is a choice to find meaning in the story we are given.",
    "Within the familiar lies a comfort that allows us to build and create without the paralysis of infinite possibility.",
  ];

  // Handle Initial Complete mit localStorage
  const handleInitialComplete = () => {
    setLoading(false);

    // Im localStorage speichern, dass der Benutzer die InitialPage gesehen hat
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenInitialPage", "true");
    }
  };

  // Verbesserte Pill-Handler mit sanftem Textübergang
  const handleRedPill = () => {
    if (quoteTransition !== "idle") return; // Verhindert Überlappung der Animationen

    // Kurzer Flash-Effekt für die rote Pille
    setPillFlashEffect("red");
    setTimeout(() => setPillFlashEffect("none"), 500);

    // Sanfter Übergang: Ausblenden -> Neuer Text -> Einblenden
    setQuoteTransition("fadeOut");

    // Nach dem Ausblenden das neue Zitat vorbereiten
    setTimeout(() => {
      // Zufälliges Zitat auswählen
      const randomQuote =
        redPillQuotes[Math.floor(Math.random() * redPillQuotes.length)];
      setMatrixQuote(randomQuote);
      setDisplayedQuote("");
      setQuoteTransition("typing");
    }, 400); // Nach der FadeOut-Animation (300ms)
  };

  const handleBluePill = () => {
    if (quoteTransition !== "idle") return; // Verhindert Überlappung der Animationen

    // Kurzer Flash-Effekt für die blaue Pille
    setPillFlashEffect("blue");
    setTimeout(() => setPillFlashEffect("none"), 500);

    // Sanfter Übergang: Ausblenden -> Neuer Text -> Einblenden
    setQuoteTransition("fadeOut");

    // Nach dem Ausblenden das neue Zitat vorbereiten
    setTimeout(() => {
      // Zufälliges Zitat auswählen
      const randomQuote =
        bluePillQuotes[Math.floor(Math.random() * bluePillQuotes.length)];
      setMatrixQuote(randomQuote);
      setDisplayedQuote("");
      setQuoteTransition("typing");
    }, 400); // Nach der FadeOut-Animation (300ms)
  };

  // Schreibmaschinen-Effekt für das Matrix-Zitat
  useEffect(() => {
    if (!matrixQuote || quoteTransition !== "typing") return;

    if (displayedQuote.length < matrixQuote.length) {
      const timer = setTimeout(() => {
        setDisplayedQuote((prev) => prev + matrixQuote[displayedQuote.length]);
      }, 25); // Schnelleres Tippen für ein besseres Erlebnis

      return () => clearTimeout(timer);
    } else {
      // Text ist fertig getippt
      setTimeout(() => {
        setQuoteTransition("idle");
      }, 500); // Kurze Pause nach dem Tippen
    }
  }, [matrixQuote, displayedQuote, quoteTransition]);

  // Terminal typing effect für den ursprünglichen Text
  useEffect(() => {
    if (loading || textComplete || matrixQuote) return;

    if (currentTextIndex < textToType.length) {
      const currentFullText = textToType[currentTextIndex];

      if (typedText.length < currentFullText.length) {
        const timer = setTimeout(() => {
          setTypedText((prev) => prev + currentFullText[typedText.length]);
        }, 50);

        return () => clearTimeout(timer);
      } else if (currentTextIndex < textToType.length - 1) {
        const timer = setTimeout(() => {
          setCurrentTextIndex((prev) => prev + 1);
          setTypedText("");
        }, 500);

        return () => clearTimeout(timer);
      } else {
        setTextComplete(true);
      }
    }
  }, [
    loading,
    typedText,
    currentTextIndex,
    textComplete,
    textToType,
    matrixQuote,
  ]);

  // MatrixFrog rain effect for the main page after loading
  useEffect(() => {
    if (loading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mix of MatrixFrog characters and frog-related symbols
    const characters = "PEPATROXM10フロッグカエル0123456789";

    const fontSize = 13; // Slightly reduced font size (was 14)
    const columns = Math.floor(canvas.width / fontSize);

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      if (!ctx || !canvas) return;

      // Normale Transparenz für ein dezentes Erscheinungsbild
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // MatrixFrog Regen Farbe - immer im Matrix-Grün
      // ctx.fillStyle = "rgba(0, 255, 65, 0.75)";
      ctx.fillStyle = "#800000";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Reduced density of characters
        if (Math.random() > 0.4) {
          // 60% chance to draw a character
          // Random character to display
          const char = characters.charAt(
            Math.floor(Math.random() * characters.length)
          );

          // x-coordinate of the character, y-coordinate is drops[i] * fontSize
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        }

        // Smoother reset probability
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        // Slightly slower movement downwards
        drops[i] += 0.9; // Slightly reduced speed
      }
    };

    // Interval update
    const interval = setInterval(draw, 40);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [loading]);

  // Neuer useEffect-Hook für Hash-Navigation
  useEffect(() => {
    // Nur ausführen, wenn auf der Client-Seite und kein Loading stattfindet
    if (typeof window !== "undefined" && !loading) {
      // Prüfe, ob es einen Hash in der URL gibt
      const hash = window.location.hash;
      if (hash) {
        // Entferne das # vom Hash
        const id = hash.substring(1);
        // Suche nach dem Element mit dieser ID
        const element = document.getElementById(id);
        // Wenn das Element existiert, scrolle zu ihm
        if (element) {
          // Kurze Verzögerung, um sicherzustellen, dass die Seite vollständig geladen ist
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    }
  }, [loading]);

  return (
    <>
      {/* Navbar is always shown, even during loading */}
      {!loading && <Navbar />}

      <main className="flex min-h-screen flex-col items-center justify-between relative overflow-x-hidden bg-black">
        {/* MatrixFrog background - fixed position for scrolling effect */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full z-0"
        ></canvas>

        {/* Scanlines and CRT effects - fixed position */}
        <div className="fixed inset-0 bg-scanlines z-10 pointer-events-none"></div>
        <div className="fixed inset-0 bg-crt z-10 pointer-events-none"></div>
        <div className="fixed inset-0 vignette z-10 pointer-events-none"></div>

        {/* Loading overlay */}
        {loading && <InitialPage onComplete={handleInitialComplete} />}

        {/* Main content - only show when no longer loading */}
        {!loading && (
          <div className="w-full z-20">
            {/* Hero Section - REDUCED HEIGHT from min-h-screen to min-h-[70vh] */}
            <div className="min-h-[70vh] flex items-center justify-center px-4 pt-16">
              <div className="max-w-6xl w-full">
                <div
                  className="w-full flex flex-col lg:flex-row items-center justify-between mb-16"
                  style={{ gap: "2rem", marginTop: "80px" }}
                >
                  {/* Smaller and narrower banner format with fixed height for terminal */}
                  <div className="w-full flex justify-center fade-in fade-in-delay-1">
                    <div
                      className={`terminal-container bg-black bg-opacity-50 border border-matrix-green rounded-md p-4 scale-in-center ${
                        pillFlashEffect !== "none"
                          ? "terminal-flash terminal-glitch"
                          : ""
                      }`}
                    >
                      {/* MatrixFrog Zitat (wenn vorhanden) oder Standard-Text */}
                      {matrixQuote ? (
                        <div className="text-matrix-green p-2 overflow-hidden">
                          <p
                            className={`text-xl leading-relaxed ${
                              quoteTransition === "fadeOut"
                                ? "text-fade-out"
                                : quoteTransition === "typing"
                                ? "text-fade-in"
                                : ""
                            }`}
                          >
                            {displayedQuote}
                            {quoteTransition === "typing" && (
                              <span className="terminal-cursor-inline"></span>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div
                          className={
                            quoteTransition === "fadeOut" ? "text-fade-out" : ""
                          }
                        >
                          {currentTextIndex === 0 && (
                            <p className="text-matrix-green text-xl terminal leading-relaxed">
                              {typedText}
                              {!textComplete && currentTextIndex === 0 && (
                                <span className="terminal-cursor-inline"></span>
                              )}
                            </p>
                          )}

                          {(currentTextIndex === 1 || textComplete) && (
                            <p className="text-matrix-green text-xl terminal leading-relaxed">
                              {textToType[0]}
                            </p>
                          )}

                          {(currentTextIndex === 1 || textComplete) && (
                            <p className="text-matrix-green text-base mt-4 opacity-80">
                              {currentTextIndex === 1
                                ? typedText
                                : textToType[1]}
                              {!textComplete && currentTextIndex === 1 && (
                                <span className="terminal-cursor-inline"></span>
                              )}
                              {textComplete && (
                                <span className="terminal-cursor"></span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image section moved below the banner - centered */}
                <div className="w-full flex justify-center mb-8">
                  <div
                    className="fade-slide-up"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <Image
                      src="/matrixfrog.png"
                      alt="Human Hand vs Frog Hand"
                      width={400}
                      height={400}
                      className="image-reveal animate-flicker matrix-image"
                      priority
                    />
                  </div>
                </div>

                {/* Pill Images - Mit überschriften - REDUCED MARGIN from mb-16 to mb-6 */}
                <div
                  className="w-full flex justify-center mb-2 relative fade-slide-up"
                  style={{ height: "200px", animationDelay: "0.6s" }}
                >
                  <div className="pills-container">
                    {/* Red Pill */}
                    <div
                      className="absolute left-pill-position pill-reveal pill-reveal-red"
                      style={{ transform: "translateY(10px)" }}
                    >
                      <div className="text-center mb-2">
                        <span className="glow-text-red">CHOOSE RED PILL</span>
                      </div>
                      <div
                        className="image-container cursor-pointer pill-hover"
                        onClick={handleRedPill}
                      >
                        <Image
                          // src="/red.png"
                          src="/red-pills.png"
                          alt="Red Pill"
                          width={110}
                          height={110}
                          className={`pill-image ${
                            pillFlashEffect === "red" ? "pill-flash-red" : ""
                          }`}
                          style={{
                            filter:
                              "drop-shadow(0 0 10px rgba(255, 0, 0, 0.7))",
                            transition: "all 0.3s ease",
                            maxWidth: "100%",
                            height: "auto",
                            paddingTop: 10,
                          }}
                          priority
                        />
                      </div>
                    </div>

                    {/* Blue Pill */}
                    <div
                      className="absolute right-pill-position pill-reveal pill-reveal-blue"
                      style={{ transform: "translateY(10px)" }}
                    >
                      <div className="text-center mb-2">
                        <span className="glow-text-green">
                          CHOOSE BLUE PILL
                        </span>
                      </div>
                      <div
                        className="image-container cursor-pointer pill-hover"
                        onClick={handleBluePill}
                      >
                        <Image
                          // src="/blue.png"
                          src="/green-pills.png"
                          alt="Green Pill"
                          width={110}
                          height={110}
                          className={`pill-image ${
                            pillFlashEffect === "blue" ? "pill-flash-blue" : ""
                          }`}
                          style={{
                            filter:
                              // "drop-shadow(0 0 10px rgba(0, 100, 255, 0.7))",
                              "drop-shadow(0 0 10px rgba(0, 255, 8, 0.7))",
                            transition: "all 0.3s ease",
                            maxWidth: "100%",
                            height: "auto",
                            paddingTop: 10,
                          }}
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add MatrixFrog Scroll Arrow Component */}
            <MatrixScrollArrow />

            {/* About Section - Add negative margin to pull it up closer to pills */}
            <div className="-mt-16" id="about">
              <AboutSection />
            </div>

            {/* Buy Bot Section */}
            <div id="buybot">
              <BuyBotSection />
            </div>

            {/* Roadmap Section - Jetzt nach dem Wallet Tracker */}
            <div id="roadmap">
              <RoadmapSection />
            </div>

            {/* Footer */}
            <Footer />
          </div>
        )}
      </main>
    </>
  );
}
