import { formatUnits, parseUnits } from "ethers";

// Convert a string amount to a bigint
export function toBigInt(
	amount: string | undefined | null,
	decimals: number
): bigint {
	if (!amount || amount === "") {
		return BigInt(0);
	}
	return parseUnits(amount, decimals);
}

// Format a bigint to a string amount
export function formatBigInt(
	amount: bigint | undefined | null,
	decimals: number
): string {
	if (!amount) {
		return "0";
	}
	return formatUnits(amount, decimals);
}
