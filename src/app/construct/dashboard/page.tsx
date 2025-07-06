"use client";
import { Progress } from "@/app/components/ui/progress";
import { BarChart3, FileVideo, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useRouter } from "next/navigation";
import { formatUnits, parseEther } from "viem";
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

const MFG_TOKEN_ADDRESS = "0x434DD2AFe3BAf277ffcFe9Bef9787EdA6b4C38D5";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Custom hook for MFG balance
const useMFGBalance = () => {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    address: MFG_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    account: isConnected && address ? address : undefined,
  });

  const formattedBalance = balance
    ? formatTokenBalance(balance as bigint, 18)
    : "0";

  return {
    balance: formattedBalance,
    rawBalance: balance,
    isLoading,
    error,
    refetch,
  };
};

// Custom hook for voting wallet balances
const useVotingWalletBalances = () => {
  const RED_PILL_ADDRESS = "0x811e9Bceeab4D26Af545E1039dc37a32100570d3";
  const GREEN_PILL_ADDRESS = "0x81D1851281d12733DCF175A3476FD1f1B245aE53";

  const {
    data: redPillBalance,
    isLoading: redPillLoading,
    refetch: refetchRedPill,
  } = useReadContract({
    address: MFG_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [RED_PILL_ADDRESS],
  });

  const {
    data: greenPillBalance,
    isLoading: greenPillLoading,
    refetch: refetchGreenPill,
  } = useReadContract({
    address: MFG_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [GREEN_PILL_ADDRESS],
  });

  // Calculate vote counts based on token balances (1000 tokens per vote)
  const redPillVotes = redPillBalance ? Number(formatUnits(redPillBalance as bigint, 18)) / 1000 : 0;
  const greenPillVotes = greenPillBalance ? Number(formatUnits(greenPillBalance as bigint, 18)) / 1000 : 0;
  const totalVotes = redPillVotes + greenPillVotes;

  return {
    redPillVotes: Math.floor(redPillVotes),
    greenPillVotes: Math.floor(greenPillVotes),
    totalVotes: Math.floor(totalVotes),
    redPillBalance: redPillBalance ? formatTokenBalance(redPillBalance as bigint, 18) : "0",
    greenPillBalance: greenPillBalance ? formatTokenBalance(greenPillBalance as bigint, 18) : "0",
    isLoading: redPillLoading || greenPillLoading,
    refetch: () => {
      refetchRedPill();
      refetchGreenPill();
    },
  };
};

const formatTokenBalance = (balance: bigint, decimals = 18) => {
  const tokenAmount = formatUnits(balance, decimals);
  const numericValue = parseFloat(tokenAmount);
  return numericValue.toLocaleString("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

export default function MatrixConstruct() {
  const [selectedEpisode, setSelectedEpisode] = useState("episode-1");
  const [selectedBlooper, setSelectedBlooper] = useState("blooper-1");
  // const [selected, setSelected] = useState(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("saga");
  // const [videoError, setVideoError] = useState(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const { isConnected, address } = useAccount();
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const {
    balance: mfgBalance,
    rawBalance: rawMfgBalance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useMFGBalance();

  const {
    redPillVotes,
    greenPillVotes,
    totalVotes,
    redPillBalance,
    greenPillBalance,
    isLoading: votingStatsLoading,
    refetch: refetchVotingStats,
  } = useVotingWalletBalances();

  const {
    writeContract,
    data: hash,
    error: writeError,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });



  // Update localStorage when MFG balance changes
  useEffect(() => {
    if (mfgBalance && isConnected) {
      window.localStorage.setItem("Mat_bal", mfgBalance);
    }
  }, [mfgBalance, isConnected]);

  // Redirect if not connected or insufficient balance
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }

    if (typeof rawMfgBalance === "bigint" && rawMfgBalance < parseEther("50")) {
      router.push("/");
    }
  }, [isConnected, rawMfgBalance, router]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      setVoteSuccess(true);
      setIsVoting(false);
      setVoteError(null);

      // Refresh voting stats and user balance
      refetchBalance();
      refetchVotingStats();

      setTimeout(() => {
        setVoteSuccess(false);
      }, 5000);
    }
  }, [isConfirmed, hash, refetchBalance, refetchVotingStats]);

  // Handle transaction error
  useEffect(() => {
    if (writeError) {
      setVoteError(writeError.message);
      setIsVoting(false);
      setTimeout(() => {
        setVoteError(null);
      }, 5000);
    }
  }, [writeError]);

  const handleVote = async () => {
    if (!isConnected || !address) {
      setVoteError("Please connect your wallet first");
      return;
    }

    if (!selected) {
      setVoteError("Please select a pill option first");
      return;
    }

    const requiredAmount = parseEther("1000");
    if (!rawMfgBalance && (rawMfgBalance as bigint) < requiredAmount) {
      setVoteError(
        "Insufficient MFG balance. You need at least 1000 MFG to vote."
      );
      return;
    }

    try {
      setIsVoting(true);
      setVoteError(null);
      setVoteSuccess(false);

      // Different wallet addresses for red and green votes
      const RED_PILL_ADDRESS = "0x811e9Bceeab4D26Af545E1039dc37a32100570d3"; // Red pill wallet
      const GREEN_PILL_ADDRESS = "0x81D1851281d12733DCF175A3476FD1f1B245aE53"; // Green pill wallet - CHANGE THIS TO A DIFFERENT ADDRESS

      const receiverAddress = selected === "red" ? RED_PILL_ADDRESS : GREEN_PILL_ADDRESS;

      await writeContract({
        address: MFG_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [receiverAddress, requiredAmount],
      });
    } catch (error) {
      console.error("Vote transaction failed:", error);
      setVoteError("Transaction failed. Please try again.");
      setIsVoting(false);
    }
  };

  const sidebarItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      subtitle: "Main control center",
      href: "/",
      active: false,
    },
    {
      icon: User,
      label: "The Peptrix Saga",
      subtitle: "Interactive story",
      href: "#",
      active: activeSection === "saga",
      onClick: () => setActiveSection("saga"),
    },
    {
      icon: FileVideo,
      label: "Bloopers",
      subtitle: "Explore scene",
      href: "#",
      active: activeSection === "bloopers",
      onClick: () => setActiveSection("bloopers"),
    },
  ];

  const blooperVideos = [
    {
      value: "blooper-1",
      title: "Blooper 1: Behind the Scenes",
      src: "https://www.youtube.com/embed/54CTSANSdUU?enablejsapi=1",
      // src: "https://www.youtube.com/watch?v=0roDfig5Ycs",
    },
    {
      value: "blooper-2",
      title: "Blooper 2: Blooper scenes",
    },
  ];

  const handleVideoError = () => {
    setVideoError(
      "Failed to load video. The video may not be embeddable or there was a connection issue."
    );
  };

  return (
    <div
      style={{
        paddingBottom: "20px",
        minHeight: "100vh",
        backgroundColor: "black",
        color: "#4ade80",
        fontFamily: "monospace",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderBottom: "1px solid rgba(34,197,94,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          <Link
            href={"/"}
            style={{
              padding: "4px 8px",
              border: "1px solid red",
              fontSize: "0.75rem",
              color: "var(--matrix-red)",
              cursor: "pointer",
            }}
          >
            EXIT
          </Link>
          <div>
            <div
              style={{
                fontSize: "2.3em",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
                color: "var(--matrix-text-light)",
              }}
            >
              THE CONSTRUCT
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--matrix-text-light)",
              }}
            >
              v2.0 access level: architect
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>
            MatrixFrog HOLDINGS
          </div>
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            $MATRIXFROG: {balanceLoading ? "Loading..." : mfgBalance}{" "}
            <Image src="/emerald.png" alt="MATRIX" width={15} height={15} />
          </div>
        </div>
      </header>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "18rem",
            padding: "18px",
            borderRight: "1px solid rgba(34,197,94,0.3)",
            minHeight: "100vh",
          }}
        >
          <nav
            style={{
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  if (item.href !== "#") router.push(item.href);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: item.active
                    ? "1px solid #22c55e"
                    : "1px solid rgba(34,197,94,0.3)",
                  backgroundColor: item.active
                    ? "rgba(34,197,94,0.1)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <item.icon style={{ width: "16px", height: "16px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "24px" }}>
          {activeSection === "saga" ? (
            <>
              {/* Video Player Section */}
              <div style={{ marginBottom: "24px" }}>
                <Card
                  style={{
                    backgroundColor: "black",
                    border: "1px solid rgba(34,197,94,0.3)",
                  }}
                >
                  <CardContent style={{ padding: "32px", textAlign: "center" }}>
                    <div
                      className="video-container"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        border: "2px solid #22c55e",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        width="100%"
                        height="315"
                        // src="https://www.youtube.com/embed/u4uWWpSvZp8?enablejsapi=1"
                        src="https://www.youtube.com/embed/0roDfig5Ycs"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ display: "block" }}
                        onError={handleVideoError}
                      ></iframe>
                      {videoError && (
                        <p
                          style={{
                            color: "#dc2626",
                            fontSize: "0.875rem",
                            marginTop: "8px",
                          }}
                        >
                          {videoError}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Episode Selection */}
              <div style={{ marginBottom: "24px" }}>
                <Select
                  value={selectedEpisode}
                  onValueChange={setSelectedEpisode}
                >
                  <SelectTrigger
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#4ade80",
                    }}
                  >
                    <SelectValue placeholder="Select Episode" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "black",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                  >
                    <SelectItem
                      value="episode-1"
                      style={{
                        color: "#4ade80",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      }}
                    >
                      Episode 1: Flying Dreams
                    </SelectItem>
                    <SelectItem
                      value="episode-2"
                      style={{
                        color: "#4ade80",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      }}
                    >
                      Episode 2: The Awakening
                    </SelectItem>
                    <SelectItem
                      value="episode-3"
                      style={{
                        color: "#4ade80",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                      }}
                    >
                      Episode 3: The Resistance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Story Section */}
              <Card
                style={{
                  backgroundColor: "black",
                  border: "1px solid rgba(34,197,94,0.3)",
                  marginBottom: "24px",
                }}
              >
                <CardHeader>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    }}
                  >
                    <CardTitle style={{ color: "#4ade80" }}>
                      The Peptrix Saga - Episode 1 - Flying Dreams
                    </CardTitle>
                    <span style={{ fontSize: "0.75rem", color: "#16a34a" }}>
                      60%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#16a34a",
                      marginBottom: "8px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    }}
                  >
                    Story Progress
                  </div>
                  <Progress
                    value={60}
                    style={{
                      height: "4px",
                      backgroundColor: "#065f46",
                      width: "98%",
                      margin: "0 auto",
                    }}
                  />
                </CardHeader>
                <CardContent>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#86efac",
                      lineHeight: "1.6",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    }}
                  >
                    Prepare to question everything. Our protagonist awakens from
                    a hauntingly vivid dream: soaring towards an unfamiliar,
                    sprawling cityscape. But the dream&apos;s tendrils have
                    followed him into the waking world, twisting his perception
                    of reality. The faces around him, the commuters on the
                    street, even his own reflection, ripple with an unsettling,
                    amphibious distortion. Every glance is a fresh wave of
                    unease, a chilling whisper that things are fundamentally
                    wrong.
                    <br />
                    As he navigates this increasingly alien world, a chance
                    encounter on his daily subway commute shatters his crumbling
                    sense of normalcy. A captivating, enigmatic woman bumps into
                    him, her eyes holding a knowing urgency. In hushed, hurried
                    tones, she delivers a cryptic warning about the very fabric
                    of his existence, the &ldquo;reality&ldquo; he inhabits,
                    before vanishing as quickly as she appeared.
                    <br />
                    Was she a figment of his fracturing mind? Or a messenger
                    from a truth too terrifying to comprehend? This chance
                    meeting ignites a desperate search for answers. Could this
                    distorted world be real? What is reality? And the most
                    unsettling question of all: who, or what, is watching his
                    every move?
                  </p>
                </CardContent>
              </Card>

              {/* Decision Section */}
              <Card
                style={{
                  backgroundColor: "black",
                  border: "1px solid rgba(34,197,94,0.3)",
                  marginBottom: "24px",
                }}
              >
                <CardHeader>
                  <CardTitle
                    style={{
                      color: "#4ade80",
                      padding: "16px",
                      fontFamily: "monospace",
                    }}
                  >
                    NEXT CHAPTER DECISION
                  </CardTitle>
                </CardHeader>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "16px",
                    margin: "0 16px",
                  }}
                >
                  <div
                    onClick={() => setSelected("red")}
                    style={{
                      border: "1px solid #dc262648",
                      padding: "0px 16px 8px 16px",
                      borderRadius: "8px",
                      backgroundColor:
                        selected === "red" ? "#450a0a" : "transparent",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#dc2626",
                        margin: "-1px -16px 12px -16px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    ></div>
                    <h3 style={{ color: "#dc2626", fontFamily: "monospace" }}>
                      THE RED PATH
                    </h3>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        marginBottom: "12px",
                        color: "#4ade80",
                      }}
                    >
                      {/* You take the red pill, you stay in Wonderland, and I show
                      you how deep the frog-hole goes. Embrace the croak, and
                      let your true amphibious self leap into the unknown. */}
                      The Red Path: The Human. A harrowing journey into the
                      depths of the mind, where sanity hangs by a thread.
                    </p>
                    {selected === "red" && (
                      <p
                        style={{
                          fontSize: "0.65rem",
                          marginTop: "8px",
                          color: "#f58080",
                          fontFamily: "monospace",
                        }}
                      >
                        1000 MatrixFrog required to vote
                      </p>
                    )}
                  </div>

                  <div
                    onClick={() => setSelected("blue")}
                    style={{
                      border: "1px solid #4ade80",
                      padding: "0px 16px 8px 16px",
                      borderRadius: "8px",
                      backgroundColor:
                        selected === "blue" ? "#29ce666f" : "#1a1a1a",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#4ade80",
                        margin: "-1px -16px 12px -16px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    ></div>
                    <h3 style={{ color: "#4ade80", fontFamily: "monospace" }}>
                      THE GREEN PATH
                    </h3>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        marginBottom: "12px",
                        color: "#4ade80",
                      }}
                    >
                      {/* You take the blue pill, the story ends, you wake up in
                      your bed and believe whatever you want to believe. Perhaps
                      these are just delusions, but if this isn&apos;t real,
                      then what truly is, and how long can you deny the frog
                      within? */}
                      The Green Path: The Amphibian. A profound exploration
                      beyond perceived reality, embracing a new, expansive
                      consciousness.
                    </p>
                    {selected === "blue" && (
                      <p
                        style={{
                          fontSize: "0.65rem",
                          marginTop: "8px",
                          color: "#4ade80",
                          fontFamily: "monospace",
                        }}
                      >
                        1000 MatrixFrog required to vote
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {voteSuccess && (
                  <div
                    style={{
                      backgroundColor: "#065f46",
                      color: "#4ade80",
                      padding: "12px",
                      margin: "16px",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    ✅ {selected === "red" ? "Red Pill" : "Green Pill"} vote successful! 1000 MATRIX transferred.
                  </div>
                )}

                {voteError && (
                  <div
                    style={{
                      backgroundColor: "#7f1d1d",
                      color: "#fecaca",
                      padding: "12px",
                      margin: "16px",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontFamily: "monospace",
                    }}
                  >
                    ❌ {voteError}
                  </div>
                )}

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "24px",
                    marginBottom: "16px",
                    marginLeft: "16px",
                    marginRight: "16px",
                  }}
                >
                  <button
                    onClick={handleVote}
                    disabled={
                      !isHydrated ||
                      !selected ||
                      isVoting ||
                      isPending ||
                      isConfirming ||
                      !isConnected
                    }
                    style={{
                      backgroundColor:
                        !isHydrated ||
                          !selected ||
                          isVoting ||
                          isPending ||
                          isConfirming ||
                          !isConnected
                          ? "#374151"
                          : "#16a34a",
                      color:
                        !isHydrated ||
                          !selected ||
                          isVoting ||
                          isPending ||
                          isConfirming ||
                          !isConnected
                          ? "#9ca3af"
                          : "black",
                      borderRadius: "8px",
                      width: "100%",
                      padding: "12px 24px",
                      fontFamily: "monospace",
                      border: "none",
                      outline: "none",
                      cursor:
                        !isHydrated ||
                          !selected ||
                          isVoting ||
                          isPending ||
                          isConfirming ||
                          !isConnected
                          ? "not-allowed"
                          : "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {!isHydrated
                      ? "Loading..."
                      : !isConnected
                        ? "Connect Wallet to Vote"
                        : !selected
                          ? "Select a Choice to Vote"
                          : isVoting || isPending
                            ? "Confirming Transaction..."
                            : isConfirming
                              ? "Processing Vote..."
                              : "Cast Vote (1000 MATRIX)"}
                  </button>
                </div>
              </Card>

              <Card
                style={{
                  backgroundColor: "black",
                  border: "1px solid rgba(34,197,94,0.3)",
                  padding: "16px",
                  fontFamily: "monospace",
                }}
              >
                <CardTitle style={{ color: "#4ade80", marginBottom: "12px" }}>
                  CURRENT VOTING STATS
                </CardTitle>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    color: "#22c55e",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <p>Red Votes: {votingStatsLoading ? "Loading..." : redPillVotes}</p>
                    <p>Green Votes: {votingStatsLoading ? "Loading..." : greenPillVotes}</p>
                    <p>Total Votes: {votingStatsLoading ? "Loading..." : totalVotes}</p>
                  </div>
                  {/* <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", fontSize: "0.8rem", color: "#16a34a" }}>
                    <p>Red Wallet: {votingStatsLoading ? "Loading..." : `${redPillBalance} MATRIX`}</p>
                    <p>Green Wallet: {votingStatsLoading ? "Loading..." : `${greenPillBalance} MATRIX`}</p>
                  </div> */}
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Bloopers Section */}
              <div style={{ marginBottom: "24px" }}>
                <Card
                  style={{
                    backgroundColor: "black",
                    border: "1px solid rgba(34,197,94,0.3)",
                  }}
                >
                  <CardContent style={{ padding: "32px", textAlign: "center" }}>
                    <div
                      className="video-container"
                      style={{
                        width: "100%",
                        margin: "0 auto",
                        border: "2px solid #22c55e",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        width="100%"
                        height="315"
                        src={
                          blooperVideos.find((b) => b.value === selectedBlooper)
                            ?.src
                        }
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ display: "block" }}
                        onError={handleVideoError}
                      ></iframe>
                      {videoError && (
                        <p
                          style={{
                            color: "#dc2626",
                            fontSize: "0.875rem",
                            marginTop: "8px",
                          }}
                        >
                          {videoError}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Blooper Selection */}
              <div style={{ marginBottom: "24px" }}>
                <Select
                  value={selectedBlooper}
                  onValueChange={setSelectedBlooper}
                >
                  <SelectTrigger
                    style={{
                      width: "100%",
                      backgroundColor: "black",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#4ade80",
                    }}
                  >
                    <SelectValue placeholder="Select Blooper" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "black",
                      border: "1px solid rgba(34,197,94,0.3)",
                    }}
                  >
                    {blooperVideos.map((blooper) => (
                      <SelectItem
                        key={blooper.value}
                        value={blooper.value}
                        style={{
                          color: "#4ade80",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        }}
                      >
                        {blooper.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
