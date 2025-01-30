"use client";

import { useCallback, useMemo } from "react";
import { useApproveStarknet } from "@/hooks/useApproveStarknet";
import { Button } from "@heroui/button";
import { useDynamicContext } from "@/lib/dynamic";

// Constants for ETH token on Starknet
const ETH_TOKEN_ADDRESS =
	"0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const APPROVE_AMOUNT = "0.0001";
const ETH_DECIMALS = 18;

/**
 * Component to test ERC20 token approval
 */
export function ApproveTest() {
	const { primaryWallet } = useDynamicContext();
	const { approve, isPending, isSuccess, error, transactionHash } =
		useApproveStarknet(ETH_TOKEN_ADDRESS, APPROVE_AMOUNT, ETH_DECIMALS);

	// Handle approve action
	const handleApprove = useCallback(async () => {
		if (!primaryWallet?.address) return;
		try {
			await approve();
		} catch (err) {
			console.error("Approval failed:", err);
		}
	}, [primaryWallet?.address, approve]);

	// Compute button state
	const buttonState = useMemo(
		() => ({
			isDisabled: isPending || isSuccess || !primaryWallet?.address,
			text: isSuccess ? "Approved" : "Approve",
		}),
		[isPending, isSuccess, primaryWallet?.address]
	);

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
			<h3 className="font-bold mb-2">Approve Test</h3>

			<Button
				isDisabled={buttonState.isDisabled}
				isLoading={isPending}
				onPress={handleApprove}
			>
				{buttonState.text}
			</Button>

			{isPending && (
				<p className="text-gray-500">Transaction pending...</p>
			)}
			{error && <p className="text-red-500">Error: {error.message}</p>}
			{transactionHash && (
				<p className="text-sm break-words">
					TX Hash: {transactionHash}
				</p>
			)}
			{isSuccess && (
				<p className="text-green-500">Successfully approved!</p>
			)}
		</div>
	);
}
