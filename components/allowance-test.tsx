"use client";

import { useCallback, useMemo } from "react";
import { useStarknetAllowance } from "@/hooks/useStarknetAllowance";
import { Button } from "@heroui/button";
import { useDynamicContext } from "@/lib/dynamic";
import { formatBigInt } from "@/helpers/format-utils";

// Constants for ETH token on Starknet
const ETH_TOKEN_ADDRESS =
	"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const TEST_AMOUNT = "0.0001";
const ETH_DECIMALS = 18;

/**
 * Component to test and display ERC20 token allowance
 */
export function AllowanceTest() {
	const { primaryWallet } = useDynamicContext();
	const { allowanceData, isLoading, error, checkAllowance } =
		useStarknetAllowance(ETH_TOKEN_ADDRESS, TEST_AMOUNT, ETH_DECIMALS);

	// Handle allowance check
	const handleCheckAllowance = useCallback(() => {
		if (primaryWallet?.address) {
			checkAllowance();
		}
	}, [primaryWallet?.address, checkAllowance]);

	// Compute allowance status display
	const allowanceStatus = useMemo(() => {
		if (!allowanceData) return null;

		const isAllowanceSufficient = allowanceData.hasAllowance;
		return {
			statusText: isAllowanceSufficient
				? "Sufficient Allowance"
				: "Insufficient Allowance",
			statusColor: isAllowanceSufficient
				? "text-green-500"
				: "text-yellow-500",
		};
	}, [allowanceData]);

	if (!primaryWallet?.address) {
		return (
			<div className="p-4 border rounded-lg">
				<p className="text-yellow-500">
					Please connect your wallet first
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 border rounded-lg space-y-3">
			<h3 className="font-bold mb-2">Allowance Test</h3>

			<Button
				isDisabled={isLoading || !primaryWallet?.address}
				isLoading={isLoading}
				onPress={handleCheckAllowance}
			>
				Check Allowance
			</Button>

			{isLoading && <p className="text-gray-500">Loading...</p>}
			{error && <p className="text-red-500">Error: {error.message}</p>}

			{allowanceData && (
				<div className="space-y-2">
					<p>
						Current Allowance:{" "}
						{formatBigInt(
							allowanceData.currentAllowance,
							ETH_DECIMALS
						)}
					</p>
					<p>
						Required Amount:{" "}
						{formatBigInt(
							allowanceData.requiredAmount,
							ETH_DECIMALS
						)}
					</p>
					{allowanceStatus && (
						<p className={allowanceStatus.statusColor}>
							{allowanceStatus.statusText}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
