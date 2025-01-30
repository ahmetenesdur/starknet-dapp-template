import { useReadContract } from "@starknet-react/core";
import { uint256 } from "starknet";

import { useNetworkStore } from "@/stores/network-store";

import { isStarknetWallet, useDynamicContext } from "@/lib/dynamic";

import { toBigInt } from "@/helpers/format-utils";

// ABI for the ERC20 allowance function
const ALLOWANCE_ABI = [
	{
		name: "allowance",
		type: "function",
		inputs: [
			{ name: "owner", type: "core::felt252" },
			{ name: "spender", type: "core::felt252" },
		],
		outputs: [{ type: "core::integer::u256" }],
		state_mutability: "view",
	},
] as const;

// Spender address for the DEX aggregator contract
const SPENDER_ADDRESS =
	"0x00f6f4cf62e3c010e0ac2451cc7807b5eec19a40b0faacd00cca3914280fdf5a";

interface AllowanceData {
	hasAllowance: boolean;
	currentAllowance: bigint;
	requiredAmount: bigint;
}

/**
 * Hook to check ERC20 token allowance on Starknet
 * @param tokenAddress - The address of the ERC20 token
 * @param amount - The amount to check allowance for
 * @param decimals - The number of decimals for the token
 */
export function useStarknetAllowance(
	tokenAddress: string,
	amount: string,
	decimals: number
) {
	const { primaryWallet } = useDynamicContext();
	const { network } = useNetworkStore();

	// Query allowance using starknet-react hook
	const { data, isPending, error, refetch } = useReadContract({
		functionName: "allowance",
		abi: ALLOWANCE_ABI,
		address: tokenAddress as `0x${string}`,
		args: primaryWallet?.address
			? [primaryWallet.address, SPENDER_ADDRESS]
			: undefined,
		watch: true,
		enabled:
			!!primaryWallet &&
			network === "starknet" &&
			!!tokenAddress &&
			!!amount &&
			!!decimals,
	});

	// Process allowance data
	const allowanceData: AllowanceData = data
		? {
				hasAllowance:
					BigInt(data.toString()) >=
					toBigInt(amount || "0", decimals),
				currentAllowance: BigInt(data.toString()),
				requiredAmount: toBigInt(amount || "0", decimals),
			}
		: {
				hasAllowance: false,
				currentAllowance: 0n,
				requiredAmount: toBigInt(amount || "0", decimals),
			};

	return {
		allowanceData,
		isLoading: isPending,
		error,
		checkAllowance: refetch,
	};
}
