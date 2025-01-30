"use client";

import { useCallback } from "react";

import { Button } from "@heroui/button";
import { DynamicWidget, useDynamicContext } from "@/lib/dynamic";

interface WalletDisplayProps {
	address: string;
}

/**
 * Displays the wallet address in a formatted way
 */
const WalletDisplay = ({ address }: WalletDisplayProps) => (
	<p className="text-sm font-medium">
		Wallet Address: {address.slice(0, 6)}...{address.slice(-4)}
	</p>
);

/**
 * ConnectWallet component handles wallet connection functionality
 * using Dynamic's authentication flow
 */
export const ConnectWallet = () => {
	const { primaryWallet, setShowAuthFlow, handleLogOut } =
		useDynamicContext();

	// Handle wallet connection
	const handleConnect = useCallback(() => {
		setShowAuthFlow(true);
	}, [setShowAuthFlow]);

	return (
		<div className="flex flex-col items-center gap-4">
			{/* Dynamic's default wallet widget */}
			<DynamicWidget />

			{/* Custom connect button */}
			{!primaryWallet && (
				<Button
					className="min-w-[200px]"
					size="lg"
					variant="solid"
					onPress={handleConnect}
				>
					Connect Wallet
				</Button>
			)}

			{/* Display wallet info when connected */}
			{primaryWallet && (
				<div className="flex flex-col items-center gap-3">
					<WalletDisplay address={primaryWallet.address} />
					{/* Log out button */}
					<Button
						className="min-w-[200px]"
						color="danger"
						variant="bordered"
						onPress={handleLogOut}
					>
						Log Out
					</Button>
				</div>
			)}
		</div>
	);
};
