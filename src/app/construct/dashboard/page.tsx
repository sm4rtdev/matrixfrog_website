"use client";
import { Progress } from "@/app/components/ui/progress";
import { BarChart3, FileVideo, User } from "lucide-react";
import Image from "next/image";
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
import VotingSection from "./VotingSection";
import { EPISODE_CONFIGS, getEpisodeStatus, getCachedVotingResults, finalizeVotingResults, checkAndAutoFinalizeAllEpisodes } from "./episodeConfig";

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

// Custom hook for voting wallet balances (Hybrid System)
const useVotingWalletBalances = (episodeId: string) => {
  // Get episode configuration first
  const episode = getEpisodeStatus(episodeId);

  // Use episode-specific wallet addresses or defaults
  const redWalletAddress = episode?.redWalletAddress || "0x811e9Bceeab4D26Af545E1039dc37a32100570d3";
  const greenWalletAddress = episode?.greenWalletAddress || "0x81D1851281d12733DCF175A3476FD1f1B245aE53";

  const {
    data: redPillBalance,
    isLoading: redPillLoading,
    refetch: refetchRedPill,
  } = useReadContract({
    address: MFG_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [redWalletAddress],
  });

  const {
    data: greenPillBalance,
    isLoading: greenPillLoading,
    refetch: refetchGreenPill,
  } = useReadContract({
    address: MFG_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [greenWalletAddress],
  });

  // Handle edge cases
  if (!episodeId || !episode) {
    return {
      redPillVotes: 0,
      greenPillVotes: 0,
      totalVotes: 0,
      redPillBalance: "0",
      greenPillBalance: "0",
      isLoading: false,
      refetch: () => {
        refetchRedPill();
        refetchGreenPill();
      },
    };
  }

  // Calculate current vote counts from wallet balances
  const currentRedVotes = redPillBalance ? Number(formatUnits(redPillBalance as bigint, 18)) / 1000 : 0;
  const currentGreenVotes = greenPillBalance ? Number(formatUnits(greenPillBalance as bigint, 18)) / 1000 : 0;
  const currentTotalVotes = currentRedVotes + currentGreenVotes;

  // For completed episodes, use cached results if available
  if (episode.status === 'completed') {
    const cachedResults = typeof window !== 'undefined' ? getCachedVotingResults(episodeId) : null;

    if (cachedResults) {
      return {
        redPillVotes: cachedResults.redVotes,
        greenPillVotes: cachedResults.greenVotes,
        totalVotes: cachedResults.totalVotes,
        redPillBalance: redPillBalance ? formatTokenBalance(redPillBalance as bigint, 18) : "0",
        greenPillBalance: greenPillBalance ? formatTokenBalance(greenPillBalance as bigint, 18) : "0",
        isLoading: redPillLoading || greenPillLoading,
        refetch: () => {
          refetchRedPill();
          refetchGreenPill();
        },
      };
    } else {
      const finalRedVotes = Math.floor(currentRedVotes);
      const finalGreenVotes = Math.floor(currentGreenVotes);
      const finalTotalVotes = Math.floor(currentTotalVotes);

      if (typeof window !== 'undefined') {
        finalizeVotingResults(episodeId, finalRedVotes, finalGreenVotes);
      }

      return {
        redPillVotes: finalRedVotes,
        greenPillVotes: finalGreenVotes,
        totalVotes: finalTotalVotes,
        redPillBalance: redPillBalance ? formatTokenBalance(redPillBalance as bigint, 18) : "0",
        greenPillBalance: greenPillBalance ? formatTokenBalance(greenPillBalance as bigint, 18) : "0",
        isLoading: redPillLoading || greenPillLoading,
        refetch: () => {
          refetchRedPill();
          refetchGreenPill();
        },
      };
    }
  }

  // For active and upcoming episodes, use current wallet balances
  return {
    redPillVotes: Math.floor(currentRedVotes),
    greenPillVotes: Math.floor(currentGreenVotes),
    totalVotes: Math.floor(currentTotalVotes),
    redPillBalance: redPillBalance ? formatTokenBalance(redPillBalance as bigint, 18) : "0",
    greenPillBalance: greenPillBalance ? formatTokenBalance(greenPillBalance as bigint, 18) : "0",
    isLoading: redPillLoading || greenPillLoading,
    refetch: () => {
      refetchRedPill();
      refetchGreenPill();
    },
  };
};

const getVotingBalances = async (episodeId: string) => {
  const episode = getEpisodeStatus(episodeId);
  if (!episode) return { redVotes: 0, greenVotes: 0 };

  // const redWalletAddress = episode.redWalletAddress;
  // const greenWalletAddress = episode.greenWalletAddress;

  try {
    const cachedResults = typeof window !== 'undefined' ? getCachedVotingResults(episodeId) : null;

    if (cachedResults) {
      return {
        redVotes: cachedResults.redVotes,
        greenVotes: cachedResults.greenVotes
      };
    }

    return { redVotes: 0, greenVotes: 0 };
  } catch (error) {
    console.error('Failed to get voting balances:', error);
    return { redVotes: 0, greenVotes: 0 };
  }
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
    isLoading: votingStatsLoading,
    refetch: refetchVotingStats,
  } = useVotingWalletBalances(selectedEpisode || "episode-1");

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

  useEffect(() => {
    const checkVotingEnd = async () => {
      try {
        const results = await checkAndAutoFinalizeAllEpisodes(
          async (episodeId) => {
            const balances = await getVotingBalances(episodeId);
            return balances.redVotes;
          },
          async (episodeId) => {
            const balances = await getVotingBalances(episodeId);
            return balances.greenVotes;
          }
        );

        if (results.length > 0) {
          console.log('Auto-finalized episodes:', results);
          refetchVotingStats();
        }
      } catch (error) {
        console.error('Failed to check voting end:', error);
      }
    };

    checkVotingEnd();

    const interval = setInterval(checkVotingEnd, 60000);

    return () => clearInterval(interval);
  }, [refetchVotingStats]);

  useEffect(() => {
    const episode = getEpisodeStatus(selectedEpisode);
    if (!episode || episode.status !== 'active') return;

    const now = new Date();
    const votingEndDate = episode.votingEndDate;

    if (votingEndDate && now > votingEndDate) {
      const finalRedVotes = Math.floor(redPillVotes);
      const finalGreenVotes = Math.floor(greenPillVotes);

      if (finalRedVotes > 0 || finalGreenVotes > 0) {
        finalizeVotingResults(selectedEpisode, finalRedVotes, finalGreenVotes);
        console.log(`Voting period ended for ${selectedEpisode}. Results cached.`);
        refetchVotingStats();
      }
    }
  }, [selectedEpisode, redPillVotes, greenPillVotes, refetchVotingStats]);

  const handleVote = async () => {
    if (!isConnected || !address) {
      setVoteError("Please connect your wallet first");
      return;
    }

    if (!selected) {
      setVoteError("Please select a pill option first");
      return;
    }

    const episode = getEpisodeStatus(selectedEpisode);
    if (!episode || episode.status !== 'active') {
      setVoteError("Voting is not active for this episode");
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

      const receiverAddress = selected === "red" ? episode.redWalletAddress : episode.greenWalletAddress;

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
        className="construct-header"
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
          <div>
            <div
              style={{
                fontSize: "2.3em",
                fontWeight: "bold",
                textShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
                color: "var(--matrix-text-light)",
              }}
              className="construct-title"
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
            className="construct-balance"
          >
            $MATRIXFROG: {balanceLoading ? "Loading..." : mfgBalance}{" "}
            <Image src="/emerald.png" alt="MATRIX" width={15} height={15} />
          </div>
        </div>
      </header>
      <div style={{ display: "flex" }} className="construct-dashboard">
        {/* Sidebar */}
        <div
          style={{
            width: "18rem",
            padding: "18px",
            borderRight: "1px solid rgba(34,197,94,0.3)",
            minHeight: "100vh",
          }}
          className="construct-sidebar"
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
        <main style={{ flex: 1, padding: "24px" }} className="construct-main">
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
                    {EPISODE_CONFIGS.map((episode) => (
                      <SelectItem
                        key={episode.id}
                        value={episode.id}
                        style={{
                          color: "#4ade80",
                          paddingTop: "4px",
                          paddingBottom: "4px",
                        }}
                      >
                        {episode.title} {episode.status === 'completed' ? '✅' : episode.status === 'active' ? '🔄' : '⏳'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Test Buttons - Only show for Episode 1 */}
                {selectedEpisode === "episode-1" && (
                  <div style={{
                    marginTop: "12px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap"
                  }}>
                    <button
                      onClick={async () => {
                        try {
                          const balances = await getVotingBalances("episode-1");
                          finalizeVotingResults("episode-1", balances.redVotes, balances.greenVotes);
                          console.log('Manual auto-finalize completed for Episode 1');
                          refetchVotingStats();
                        } catch (error) {
                          console.error('Manual auto-finalize failed:', error);
                        }
                      }}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "rgba(34,197,94,0.2)",
                        border: "1px solid rgba(34,197,94,0.5)",
                        color: "#4ade80",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "monospace",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(34,197,94,0.3)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.7)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(34,197,94,0.2)";
                        e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)";
                      }}
                    >
                      Auto Finalize
                    </button>

                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const testCacheData = {
                            redVotes: 27,
                            greenVotes: 26,
                            totalVotes: 53,
                            timestamp: new Date().toISOString()
                          };
                          localStorage.setItem('voting_cache_episode-1', JSON.stringify(testCacheData));
                          console.log('Test cache set for Episode 1:', testCacheData);
                          refetchVotingStats();
                        }
                      }}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "rgba(59,130,246,0.2)",
                        border: "1px solid rgba(59,130,246,0.5)",
                        color: "#60a5fa",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "monospace",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(59,130,246,0.3)";
                        e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(59,130,246,0.2)";
                        e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
                      }}
                    >
                      Test Cache
                    </button>
                  </div>
                )}
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
                    {(() => {
                      const episode = getEpisodeStatus(selectedEpisode || "episode-1");
                      return episode?.description || "Episode description not available.";
                    })()}
                  </p>
                </CardContent>
              </Card>

              {/* Voting Section */}
              {(() => {
                const episode = getEpisodeStatus(selectedEpisode || "episode-1");
                if (!episode) {
                  return (
                    <Card
                      style={{
                        backgroundColor: "black",
                        border: "1px solid rgba(34,197,94,0.3)",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ color: "#4ade80" }}>Episode not found. Please select a valid episode.</p>
                    </Card>
                  );
                }

                return (
                  <VotingSection
                    episode={episode}
                    selected={selected}
                    setSelected={setSelected}
                    isVoting={isVoting}
                    voteSuccess={voteSuccess}
                    voteError={voteError}
                    isHydrated={isHydrated}
                    isConnected={isConnected}
                    isPending={isPending}
                    isConfirming={isConfirming}
                    onVote={handleVote}
                    redPillVotes={redPillVotes}
                    greenPillVotes={greenPillVotes}
                    totalVotes={totalVotes}
                    votingStatsLoading={votingStatsLoading}
                  />
                );
              })()}
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
