// components/MatrixGate.tsx
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

const MATRIX_TOKEN_CA = "0x2044682dad187456af1eee1b4e02bbf0a9abc919";
const ABI = [
  // Minimal ERC-20 ABI
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

export default function MatrixGate() {
  const { address, isConnected } = useAccount();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: balanceData, refetch } = useReadContract({
    address: MATRIX_TOKEN_CA,
    abi: ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
  });

  const { data: decimalsData } = useReadContract({
    address: MATRIX_TOKEN_CA,
    abi: ABI,
    functionName: "decimals",
  });

  useEffect(() => {
    const checkAccess = async () => {
      if (!balanceData || !decimalsData) return;
      setLoading(true);
      const balance = formatUnits(balanceData, decimalsData);
      setIsAllowed(Number(balance) >= 50000);
      setLoading(false);
    };

    checkAccess();
  }, [balanceData, decimalsData]);

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <ConnectButton />
      {isConnected && (
        <>
          {loading ? (
            <p className="text-gray-600 mt-4">
              Verifying your Matrix balance...
            </p>
          ) : isAllowed ? (
            <div className="mt-4 text-green-600 font-bold">
              ✅ You have access to The Construct!
              {/* Put your Construct component here */}
              <div className="mt-4">
                <p>Watch the latest video and vote:</p>
                <div className="flex flex-col gap-2 mt-2">
                  <a
                    href={`https://etherscan.io/address/0x811e9Bceeab4D26Af545E1039dc37a32100570d3`}
                    target="_blank"
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    Vote Red
                  </a>
                  <a
                    href={`https://etherscan.io/address/0x81D1851281d12733DCF175A3476FD1f1B245aE53`}
                    target="_blank"
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                  >
                    Vote Blue
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-red-600 font-semibold">
              ❌ You need at least 50,000 Matrix tokens to access The Construct.
            </p>
          )}
        </>
      )}
    </div>
  );
}
