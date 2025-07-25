"use client";
import { Progress } from "@/app/components/ui/progress";
import {
    BarChart3,
    // Gamepad2,
    // MessageSquare,
    Shield,
    // Terminal,
    // Trophy,
    User,
    // Vault,
    Coins,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "../../components/ui/select";
import { useRouter } from "next/navigation";
import StakingSection from "../staking/StakingSection";

export default function MatrixConstruct() {
    // const [selectedEpisode, setSelectedEpisode] = useState("episode-1");
    const [selected, setSelected] = useState<string | null>();
    const [matrixBalance, setMatrixBalance] = useState<number | null>();
    const [activeSection, setActiveSection] = useState("governance");
    const { isConnected } = useAccount();
    const router = useRouter();
    useEffect(() => {
        if (!isConnected) {
            window.location.href = "/";
        }
    }, [isConnected]);

    useEffect(() => {
        const bal = window.localStorage.getItem("Mat_bal");
        const parsed = bal ? parseFloat(bal) : 0;
        setMatrixBalance(parsed);

        if (parsed < 50) {
            window.location.href = "/";
        }
    }, []);

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
            href: "/construct/dashboard",
            active: false,
        },
        {
            icon: Shield,
            label: "Bloopers",
            subtitle: "bloopers",
            href: "#",
            active: activeSection === "governance",
            onClick: () => setActiveSection("governance"),
        },
        {
            icon: Coins,
            label: "Staking Section",
            subtitle: "Earn rewards",
            href: "#",
            active: activeSection === "staking",
            onClick: () => setActiveSection("staking"),
        },
        // {
        //   icon: Trophy,
        //   label: "Rewards Center",
        //   subtitle: "Claim rewards",
        //   active: false,
        // },
        // {
        //   icon: Gamepad2,
        //   label: "MatrixFrog Games",
        //   subtitle: "Play to earn",
        //   active: false,
        // },
        // {
        //   icon: MessageSquare,
        //   label: "Encrypted Chat",
        //   subtitle: "Community chat",
        //   badge: "NEW",
        //   active: false,
        // },
        // {
        //   icon: Vault,
        //   label: "NFT Vault",
        //   subtitle: "Digital collectibles",
        //   badge: "NEW",
        //   active: false,
        // },
        // {
        //   icon: Terminal,
        //   label: "MatrixFrog Terminal",
        //   subtitle: "Command interface",
        //   badge: "NEW",
        //   active: false,
        // },
    ];
    useEffect(() => {
        const bal = window.localStorage.getItem("Mat_bal");
        setMatrixBalance(bal ? parseFloat(bal) : 0);
    }, []);
    return (
        <div
            style={{
                paddingBottom: "20px",
                // paddingTop: "10px",
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
                    <div
                        style={{ fontSize: "0.75rem", color: "#16a34a" /* green-600 */ }}
                    >
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
                        $MATRIXFROG: {matrixBalance} {""}{" "}
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
                            // <Link key={index} href={item.href}>
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
                                {/* {item?.badge && (
                                    <span
                                        style={{
                                        padding: "2px 4px",
                                        fontSize: "0.75rem",
                                        backgroundColor: "red",
                                        color: "white",
                                        borderRadius: "4px",
                                        }}
                                    >
                                        {item?.badge}
                                    </span>
                                    )} */}
                            </div>
                            // </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main style={{ flex: 1, padding: "24px" }}>
                    {activeSection === "governance" ? (
                        <>
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
                                        Prepare to question everything. Our protagonist awakens from a
                                        hauntingly vivid dream: soaring towards an unfamiliar, sprawling
                                        cityscape. But the dream&apos;s tendrils have followed him into
                                        the waking world, twisting his perception of reality. The faces
                                        around him, the commuters on the street, even his own
                                        reflection, ripple with an unsettling, amphibious distortion.
                                        Every glance is a fresh wave of unease, a chilling whisper that
                                        things are fundamentally wrong.
                                        <br />
                                        As he navigates this increasingly alien world, a chance
                                        encounter on his daily subway commute shatters his crumbling
                                        sense of normalcy. A captivating, enigmatic woman bumps into
                                        him, her eyes holding a knowing urgency. In hushed, hurried
                                        tones, she delivers a cryptic warning about the very fabric of
                                        his existence, the &quot;reality&quot; he inhabits, before
                                        vanishing as quickly as she appeared.
                                        <br />
                                        Was she a figment of his fracturing mind? Or a messenger from a
                                        truth too terrifying to comprehend? This chance meeting ignites
                                        a desperate search for answers. Could this distorted world be
                                        real? What is reality? And the most unsettling question of all:
                                        who, or what, is watching his every move?
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
                                    {/* Red Pill Option */}
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
                                        {/* Red Top Strip */}
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
                                            TAKE THE RED PILL
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "0.7rem",
                                                marginBottom: "12px",
                                                color: "#4ade80",
                                            }}
                                        >
                                            You take the red pill, you stay in Wonderland, and I show you
                                            how deep the frog-hole goes. Embrace the croak, and let your
                                            true amphibious self leap into the unknown.
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
                                                50 MatrixFrog required to vote
                                            </p>
                                        )}
                                    </div>

                                    {/* Blue Pill Option */}
                                    <div
                                        onClick={() => setSelected("blue")}
                                        style={{
                                            border: "1px solid #2563eb",
                                            padding: "0px 16px 8px 16px",
                                            borderRadius: "8px",
                                            backgroundColor: selected === "blue" ? "#1e3a8a" : "#1a1a1a",
                                            cursor: "pointer",
                                            flex: 1,
                                        }}
                                    >
                                        {/* Blue Top Strip */}
                                        <div
                                            style={{
                                                height: "5px",
                                                backgroundColor: "#2563eb",
                                                margin: "-1px -16px 12px -16px",
                                                borderTopLeftRadius: "8px",
                                                borderTopRightRadius: "8px",
                                            }}
                                        ></div>

                                        <h3 style={{ color: "#3b82f6", fontFamily: "monospace" }}>
                                            STAY HIDDEN
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: "0.7rem",
                                                marginBottom: "12px",
                                                color: "#4ade80",
                                            }}
                                        >
                                            You take the blue pill, the story ends, you wake up in your
                                            bed and believe whatever you want to believe. Perhaps these
                                            are just delusions, but if this isn&apos;t real, then what
                                            truly is, and how long can you deny the frog within?
                                        </p>

                                        {/* Info message for blue pill when selected */}
                                        {selected === "blue" && (
                                            <p
                                                style={{
                                                    fontSize: "0.65rem",
                                                    marginTop: "8px",
                                                    color: "#93c5fd",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                50 MatrixFrog required to vote
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Wallet Connect Button */}
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
                                        style={{
                                            backgroundColor: "#16a34a",
                                            color: "black",
                                            borderRadius: "8px",
                                            width: "100%",
                                            padding: "12px 24px",
                                            fontFamily: "monospace",
                                            border: "none",
                                            outline: "none",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    >
                                        Connect Wallet to Vote
                                    </button>
                                </div>
                            </Card>

                            {/* Voting Stats Section */}
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
                                        justifyContent: "space-between",
                                        color: "#22c55e",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {/* <p>Red Pill Votes: 123</p>
                            <p>Blue Pill Votes: 98</p>
                            <p>Total Votes: 221</p> */}
                                </div>
                            </Card>
                        </>
                    ) : activeSection === "staking" ? (
                        <>
                            {/* Staking Section */}
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "calc(100vh - 200px)",
                                width: "100%"
                            }}>
                                <StakingSection
                                    title="Stake Your HolderRadar"
                                    subtitle="Earn rewards by staking your tokens in our secure pool."
                                    apy="30%"
                                    endDate="22.7.2026"
                                    onStakeSuccess={() => console.log("Staking successful!")}
                                    onUnstakeSuccess={() => console.log("Unstaking successful!")}
                                    onClaimSuccess={() => console.log("Claim successful!")}
                                />
                            </div>
                        </>
                    ) : null}
                </main>
            </div>
        </div>
    );
}
