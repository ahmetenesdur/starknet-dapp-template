"use client";

import { useCallback, useState } from "react";
import { AccountInterface, ProviderInterface } from "starknet";
import { Button } from "@heroui/button";
import {
	DynamicWidget,
	useDynamicContext,
	isStarknetWallet,
} from "@/lib/dynamic";

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
	const [walletProvider, setWalletProvider] = useState<any | undefined>();

	// Handle wallet connection
	const handleConnect = useCallback(() => {
		setShowAuthFlow(true);
	}, [setShowAuthFlow]);

	const getAccount = async () => {
		if (primaryWallet) {
			if (isStarknetWallet(primaryWallet)) {
				const account = await primaryWallet?.getWalletAccount();
				console.log(account.walletProvider.name);
				console.log(account.walletProvider.id);
				console.log(account.walletProvider.version);
				setWalletProvider(account);
			}
		}
	};

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
				<>
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

					<div className="flex flex-col items-center gap-3">
						<Button onPress={getAccount}>Get Account</Button>

						<span className="text-sm font-medium">
							name:{" "}
							{walletProvider?.walletProvider.name ||
								"No account selected"}
						</span>
						<span className="text-sm font-medium">
							id:{" "}
							{walletProvider?.walletProvider.id ||
								"No account selected"}
						</span>
						<span className="text-sm font-medium">
							version:{" "}
							{walletProvider?.walletProvider.version ||
								"No account selected"}
						</span>
					</div>
				</>
			)}
		</div>
	);
};
