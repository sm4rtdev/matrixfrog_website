"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { type EpisodeConfig, getVotingCountdown } from "./episodeConfig";

interface VotingSectionProps {
    episode: EpisodeConfig;
    selected: string | null;
    setSelected: (choice: string | null) => void;
    isVoting: boolean;
    voteSuccess: boolean;
    voteError: string | null;
    isHydrated: boolean;
    isConnected: boolean;
    isPending: boolean;
    isConfirming: boolean;
    onVote: () => void;
    redPillVotes: number;
    greenPillVotes: number;
    totalVotes: number;
    votingStatsLoading: boolean;
}

const VotingSection: React.FC<VotingSectionProps> = ({
    episode,
    selected,
    setSelected,
    isVoting,
    voteSuccess,
    voteError,
    isHydrated,
    isConnected,
    isPending,
    isConfirming,
    onVote,
    redPillVotes,
    greenPillVotes,
    totalVotes,
    votingStatsLoading,
}) => {
    const isVotingEnabled = episode.status === 'active' && isHydrated && isConnected;
    const isCompleted = episode.status === 'completed';
    const isUpcoming = episode.status === 'upcoming';

    const countdown = getVotingCountdown(episode);

    return (
        <>
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
                    {/* Red Path Option */}
                    <div
                        onClick={isVotingEnabled ? () => setSelected("red") : undefined}
                        style={{
                            border: "1px solid #dc262648",
                            padding: "0px 16px 8px 16px",
                            borderRadius: "8px",
                            backgroundColor: selected === "red" ? "#450a0a" : "transparent",
                            cursor: isVotingEnabled ? "pointer" : "default",
                            flex: 1,
                            opacity: isCompleted && episode.winner !== 'red' ? 0.5 : 1,
                            filter: isCompleted && episode.winner !== 'red' ? 'grayscale(100%)' : 'none',
                            borderColor: isCompleted && episode.winner === 'red' ? '#dc2626' : '#dc262648',
                            boxShadow: isCompleted && episode.winner === 'red' ? '0 0 20px rgba(220, 38, 38, 0.5)' : 'none',
                        }}
                    >
                        <div
                            style={{
                                height: "5px",
                                backgroundColor: isCompleted && episode.winner === 'red' ? '#ff4444' : "#dc2626",
                                margin: "-1px -16px 12px -16px",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                            }}
                        ></div>
                        <h3
                            style={{
                                color: isCompleted && episode.winner === 'red' ? '#ff4444' : "#dc2626",
                                fontFamily: "monospace",
                                textShadow: isCompleted && episode.winner === 'red' ? '0 0 10px rgba(255, 68, 68, 0.5)' : 'none',
                            }}
                        >
                            THE RED PATH
                            {isCompleted && episode.winner === 'red' && (
                                <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>🏆 WINNER</span>
                            )}
                        </h3>
                        <p
                            style={{
                                fontSize: "0.7rem",
                                marginBottom: "12px",
                                color: isCompleted && episode.winner !== 'red' ? "#666" : "#4ade80",
                            }}
                        >
                            {episode.redPathDescription}
                        </p>

                        {/* Red Path Vote Count - Only show for completed episodes */}
                        {isCompleted && (
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    color: episode.winner === 'red' ? '#ff4444' : "#dc2626",
                                    textAlign: "center",
                                    padding: "8px",
                                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                                    borderRadius: "4px",
                                    marginBottom: "8px",
                                    fontFamily: "monospace",
                                }}
                            >
                                {votingStatsLoading ? "Loading..." : `${redPillVotes} Votes`}
                            </div>
                        )}

                        {selected === "red" && isVotingEnabled && (
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

                    {/* Green Path Option */}
                    <div
                        onClick={isVotingEnabled ? () => setSelected("blue") : undefined}
                        style={{
                            border: "1px solid #4ade80",
                            padding: "0px 16px 8px 16px",
                            borderRadius: "8px",
                            backgroundColor: selected === "blue" ? "#29ce666f" : "#1a1a1a",
                            cursor: isVotingEnabled ? "pointer" : "default",
                            flex: 1,
                            opacity: isCompleted && episode.winner !== 'green' ? 0.5 : 1,
                            filter: isCompleted && episode.winner !== 'green' ? 'grayscale(100%)' : 'none',
                            borderColor: isCompleted && episode.winner === 'green' ? '#4ade80' : '#4ade80',
                            boxShadow: isCompleted && episode.winner === 'green' ? '0 0 20px rgba(74, 222, 128, 0.5)' : 'none',
                        }}
                    >
                        <div
                            style={{
                                height: "5px",
                                backgroundColor: isCompleted && episode.winner === 'green' ? '#4ade80' : "#4ade80",
                                margin: "-1px -16px 12px -16px",
                                borderTopLeftRadius: "8px",
                                borderTopRightRadius: "8px",
                            }}
                        ></div>
                        <h3
                            style={{
                                color: isCompleted && episode.winner === 'green' ? '#4ade80' : "#4ade80",
                                fontFamily: "monospace",
                                textShadow: isCompleted && episode.winner === 'green' ? '0 0 10px rgba(74, 222, 128, 0.5)' : 'none',
                            }}
                        >
                            THE GREEN PATH
                            {isCompleted && episode.winner === 'green' && (
                                <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>🏆 WINNER</span>
                            )}
                        </h3>
                        <p
                            style={{
                                fontSize: "0.7rem",
                                marginBottom: "12px",
                                color: isCompleted && episode.winner !== 'green' ? "#666" : "#4ade80",
                            }}
                        >
                            {episode.greenPathDescription}
                        </p>

                        {/* Green Path Vote Count - Only show for completed episodes */}
                        {isCompleted && (
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    color: episode.winner === 'green' ? '#4ade80' : "#4ade80",
                                    textAlign: "center",
                                    padding: "8px",
                                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                                    borderRadius: "4px",
                                    marginBottom: "8px",
                                    fontFamily: "monospace",
                                }}
                            >
                                {votingStatsLoading ? "Loading..." : `${greenPillVotes} Votes`}
                            </div>
                        )}

                        {selected === "blue" && isVotingEnabled && (
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
                        onClick={onVote}
                        disabled={!isVotingEnabled || !selected || isVoting || isPending || isConfirming}
                        style={{
                            backgroundColor:
                                !isVotingEnabled || !selected || isVoting || isPending || isConfirming
                                    ? "#374151"
                                    : "#16a34a",
                            color:
                                !isVotingEnabled || !selected || isVoting || isPending || isConfirming
                                    ? "#9ca3af"
                                    : "black",
                            borderRadius: "8px",
                            width: "100%",
                            padding: "12px 24px",
                            fontFamily: "monospace",
                            border: "none",
                            outline: "none",
                            cursor:
                                !isVotingEnabled || !selected || isVoting || isPending || isConfirming
                                    ? "not-allowed"
                                    : "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        {!isHydrated
                            ? "Loading..."
                            : isCompleted
                                ? "Voting Completed"
                                : isUpcoming
                                    ? countdown
                                        ? `Voting Starts in ${countdown}`
                                        : "Voting Coming Soon"
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

            {/* Voting Stats - Show for active and completed episodes */}
            {(episode.status === 'active' || isCompleted) && (
                <Card
                    style={{
                        backgroundColor: "black",
                        border: "1px solid rgba(34,197,94,0.3)",
                        padding: "16px",
                        fontFamily: "monospace",
                    }}
                >
                    <CardTitle style={{ color: "#4ade80", marginBottom: "12px" }}>
                        {isCompleted ? "FINAL VOTING RESULTS" : "CURRENT VOTING STATS"}
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
                            <p style={{
                                color: isCompleted && episode.winner === 'red' ? '#ff4444' : "#22c55e",
                                fontWeight: isCompleted && episode.winner === 'red' ? 'bold' : 'normal',
                            }}>
                                Red Votes: {votingStatsLoading ? "Loading..." : (isCompleted ? 0 : redPillVotes)}
                            </p>
                            <p style={{
                                color: isCompleted && episode.winner === 'green' ? '#4ade80' : "#22c55e",
                                fontWeight: isCompleted && episode.winner === 'green' ? 'bold' : 'normal',
                            }}>
                                Green Votes: {votingStatsLoading ? "Loading..." : (isCompleted ? 0 : greenPillVotes)}
                            </p>
                            <p>Total Votes: {votingStatsLoading ? "Loading..." : (isCompleted ? 0 : totalVotes)}</p>
                        </div>
                        {isCompleted && (
                            <div style={{
                                marginTop: "8px",
                                padding: "8px",
                                backgroundColor: "rgba(34,197,94,0.1)",
                                borderRadius: "4px",
                                textAlign: "center"
                            }}>
                                <p style={{ color: "#4ade80", fontSize: "0.9rem" }}>
                                    🏆 Winner: {episode.winner === 'red' ? 'Red Path' : 'Green Path'}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </>
    );
};

export default VotingSection; 