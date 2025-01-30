import { useProvider, useTransactionReceipt } from "@starknet-react/core";
import {
	AccountInterface,
	CallData,
	Contract,
	ProviderInterface,
	uint256,
} from "starknet";

import { useEffect, useMemo, useState } from "react";

import { isStarknetWallet, useDynamicContext } from "@/lib/dynamic";

import { toBigInt } from "@/helpers/format-utils";

// Spender address
const SPENDER_ADDRESS =
	"0x00f6f4cf62e3c010e0ac2451cc7807b5eec19a40b0faacd00cca3914280fdf5a";

interface ApproveResult {
	transactionHash: string;
}

/**
 * Hook to approve ERC20 token spending on Starknet
 * @param tokenAddress - The address of the ERC20 token
 * @param amount - The amount to approve
 * @param decimals - The number of decimals for the token
 */
export function useApproveStarknet(
	tokenAddress: string,
	amount: string,
	decimals: number
) {
	const { provider } = useProvider();
	const { primaryWallet } = useDynamicContext();
	const [transactionHash, setTransactionHash] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Watch transaction receipt
	const {
		data: receiptData,
		isLoading: isReceiptLoading,
		status,
	} = useTransactionReceipt({
		hash: transactionHash ?? "",
		watch: true,
	});

	// Update states based on transaction status
	useEffect(() => {
		setIsPending(isReceiptLoading);
		setIsSuccess(status === "success");
		setIsError(status === "error");
	}, [isReceiptLoading, status]);

	// Validate input parameters
	const validateInputs = () => {
		if (!primaryWallet?.address) return new Error("Address is missing");
		if (!tokenAddress) return new Error("Token address is missing");
		if (!amount) return new Error("Amount is missing");
		return null;
	};

	// Execute approve transaction
	const approve = async (): Promise<ApproveResult> => {
		const validationError = validateInputs();
		if (validationError) {
			setError(validationError);
			setIsError(true);
			throw validationError;
		}

		// Check if primaryWallet is a Starknet wallet
		if (!primaryWallet || !isStarknetWallet(primaryWallet)) {
			throw new Error("Invalid or missing Starknet wallet");
		}

		try {
			setIsPending(true);
			setIsError(false);
			setIsSuccess(false);
			setError(null);

			// Get account use Dynamic
			const account = await primaryWallet.getWalletAccount();
			const { abi: tokenAbi } = await provider.getClassAt(tokenAddress);

			const tokenContract = new Contract(
				tokenAbi,
				tokenAddress,
				provider as ProviderInterface
			).connect(account as AccountInterface);

			const bigAmount = toBigInt(amount, decimals);
			const amountUint256 = uint256.bnToUint256(bigAmount);

			const result = await account.execute([
				{
					contractAddress: tokenAddress,
					entrypoint: "approve",
					calldata: CallData.compile({
						spender: SPENDER_ADDRESS,
						amount: amountUint256,
					}),
				},
			]);

			setTransactionHash(result.transaction_hash);
			return { transactionHash: result.transaction_hash };
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message.split("\n")[0]
					: "Unknown error occurred";
			const error = new Error(errorMessage);
			setError(error);
			setIsError(true);
			throw error;
		} finally {
			setIsPending(false);
		}
	};

	return {
		approve,
		isPending,
		isSuccess,
		isError,
		error,
		transactionHash,
		receipt: receiptData,
	};
}
