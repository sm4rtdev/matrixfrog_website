"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits, parseEther } from "viem";
import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "../../components/ui/button";
import styles from "./staking.module.css";

// HolderRadar 토큰 주소 (예시 - 실제 주소로 변경 필요)
const HORADAR_TOKEN_ADDRESS = "0x1234567890123456789012345678901234567890";
const STAKING_CONTRACT_ADDRESS = "0x0987654321098765432109876543210987654321";

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
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
];

const STAKING_ABI = [
    {
        constant: true,
        inputs: [],
        name: "totalStaked",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "_user", type: "address" }],
        name: "userStake",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "_user", type: "address" }],
        name: "pendingRewards",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [{ name: "_amount", type: "uint256" }],
        name: "stake",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [{ name: "_amount", type: "uint256" }],
        name: "unstake",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [],
        name: "claimRewards",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
];

// 커스텀 훅: HolderRadar 잔액
const useHolderRadarBalance = () => {
    const { address, isConnected } = useAccount();

    const {
        data: balance,
        error,
        isLoading,
        refetch,
    } = useReadContract({
        address: HORADAR_TOKEN_ADDRESS,
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

// 커스텀 훅: 스테이킹 데이터
const useStakingData = () => {
    const { address, isConnected } = useAccount();

    const {
        data: totalStaked,
        isLoading: totalStakedLoading,
        refetch: refetchTotalStaked,
    } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: STAKING_ABI,
        functionName: "totalStaked",
        account: isConnected && address ? address : undefined,
    });

    const {
        data: userStake,
        isLoading: userStakeLoading,
        refetch: refetchUserStake,
    } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: STAKING_ABI,
        functionName: "userStake",
        args: address ? [address] : undefined,
        account: isConnected && address ? address : undefined,
    });

    const {
        data: pendingRewards,
        isLoading: rewardsLoading,
        refetch: refetchRewards,
    } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: STAKING_ABI,
        functionName: "pendingRewards",
        args: address ? [address] : undefined,
        account: isConnected && address ? address : undefined,
    });

    return {
        totalStaked: totalStaked ? formatTokenBalance(totalStaked as bigint, 18) : "0",
        userStake: userStake ? formatTokenBalance(userStake as bigint, 18) : "0",
        pendingRewards: pendingRewards ? formatTokenBalance(pendingRewards as bigint, 18) : "0",
        isLoading: totalStakedLoading || userStakeLoading || rewardsLoading,
        refetch: () => {
            refetchTotalStaked();
            refetchUserStake();
            refetchRewards();
        },
    };
};

const formatTokenBalance = (balance: bigint, decimals = 18) => {
    return formatUnits(balance, decimals);
};

interface StakingSectionProps {
    title?: string;
    subtitle?: string;
    apy?: string;
    endDate?: string;
    onStakeSuccess?: () => void;
    onUnstakeSuccess?: () => void;
    onClaimSuccess?: () => void;
}

export default function StakingSection({
    title = "Stake Your HolderRadar",
    subtitle = "Earn rewards by staking your tokens in our secure pool.",
    apy = "30%",
    endDate = "22.7.2026",
    onStakeSuccess,
    onUnstakeSuccess,
    onClaimSuccess,
}: StakingSectionProps) {
    const { address } = useAccount();
    const [stakeAmount, setStakeAmount] = useState("");
    const [unstakeAmount, setUnstakeAmount] = useState("");
    const [isStaking, setIsStaking] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const { balance, refetch: refetchBalance } = useHolderRadarBalance();
    const { totalStaked, userStake, pendingRewards, refetch: refetchStakingData } = useStakingData();

    // 스테이킹 컨트랙트 함수들
    const { writeContract: writeStakingContract } = useWriteContract();
    const { writeContract: writeTokenContract } = useWriteContract();

    // 데이터 새로고침
    const refetchAllData = () => {
        refetchBalance();
        refetchStakingData();
    };

    // 스테이킹 함수
    const handleStake = async () => {
        if (!stakeAmount || !address) return;

        try {
            setIsStaking(true);

            // 먼저 토큰 승인
            await writeTokenContract({
                address: HORADAR_TOKEN_ADDRESS,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [STAKING_CONTRACT_ADDRESS, parseEther(stakeAmount)],
            });

            // 스테이킹 실행
            await writeStakingContract({
                address: STAKING_CONTRACT_ADDRESS,
                abi: STAKING_ABI,
                functionName: "stake",
                args: [parseEther(stakeAmount)],
            });

            setStakeAmount("");
            refetchAllData();
            onStakeSuccess?.();
        } catch (error) {
            console.error("Staking error:", error);
        } finally {
            setIsStaking(false);
        }
    };

    // 언스테이킹 함수
    const handleUnstake = async () => {
        if (!unstakeAmount || !address) return;

        try {
            setIsUnstaking(true);

            await writeStakingContract({
                address: STAKING_CONTRACT_ADDRESS,
                abi: STAKING_ABI,
                functionName: "unstake",
                args: [parseEther(unstakeAmount)],
            });

            setUnstakeAmount("");
            refetchAllData();
            onUnstakeSuccess?.();
        } catch (error) {
            console.error("Unstaking error:", error);
        } finally {
            setIsUnstaking(false);
        }
    };

    // 보상 청구 함수
    const handleClaimRewards = async () => {
        if (!address) return;

        try {
            setIsClaiming(true);

            await writeStakingContract({
                address: STAKING_CONTRACT_ADDRESS,
                abi: STAKING_ABI,
                functionName: "claimRewards",
                args: [],
            });

            refetchAllData();
            onClaimSuccess?.();
        } catch (error) {
            console.error("Claim rewards error:", error);
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className={styles.stakingCard}>
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <div className={styles.statLabel}>APY</div>
                    <div className={styles.statValue}>{apy}</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statLabel}>TOTAL STAKED</div>
                    <div className={styles.statValue}>{totalStaked} HoRa</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statLabel}>YOUR STAKE</div>
                    <div className={styles.statValue}>{userStake} HoRa</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statLabel}>REWARDS</div>
                    <div className={styles.statValue}>{pendingRewards} HoRa</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statLabel}>BALANCE</div>
                    <div className={styles.statValue}>{balance} HoRa</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statLabel}>ENDS ON</div>
                    <div className={styles.statValue}>{endDate}</div>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <div className={styles.stakeUnstakeRow}>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            placeholder="Amount to stake"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className={styles.input}
                        />
                        <Button
                            onClick={handleStake}
                            disabled={isStaking || !stakeAmount}
                            className={styles.stakeButton}
                        >
                            {isStaking ? "Staking..." : "Stake"}
                        </Button>
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            placeholder="Amount to unstake"
                            value={unstakeAmount}
                            onChange={(e) => setUnstakeAmount(e.target.value)}
                            className={styles.input}
                        />
                        <Button
                            onClick={handleUnstake}
                            disabled={isUnstaking || !unstakeAmount}
                            className={styles.unstakeButton}
                        >
                            {isUnstaking ? "Unstaking..." : "Unstake"}
                        </Button>
                    </div>
                </div>

                <Button
                    onClick={handleClaimRewards}
                    disabled={isClaiming || parseFloat(pendingRewards) <= 0}
                    className={styles.claimButton}
                >
                    {isClaiming ? "Claiming..." : "Claim Rewards"}
                </Button>
            </div>
        </div>
    );
} 