import { mainnet, sepolia } from "@starknet-react/chains";
import {
	StarknetConfig,
	alchemyProvider,
	argent,
	blastProvider,
	braavos,
	useInjectedConnectors,
} from "@starknet-react/core";
import * as React from "react";

/**
 * Props for the StarknetProvider component
 */
interface StarknetProviderProps {
	children: React.ReactNode;
}

/**
 * Provider component for Starknet integration
 * Configures and provides Starknet context to the application
 * Handles wallet connections and network configuration
 */
export default function StarknetProvider({ children }: StarknetProviderProps) {
	// Get API key from environment variables
	const apiKey = process.env.NEXT_PUBLIC_STARKNET_API_KEY;

	// Validate API key existence
	if (!apiKey) {
		throw new Error(
			"NEXT_PUBLIC_STARKNET_API_KEY environment variable is not set"
		);
	}

	// Initialize provider with API key
	const provider = alchemyProvider({ apiKey }); // TODO: change according to with one you are using

	// Configure supported chains
	const chains = [mainnet, sepolia];

	// Setup wallet connectors this not important because we are using dynamic
	const { connectors } = useInjectedConnectors({
		recommended: [argent(), braavos()],
		includeRecommended: "onlyIfNoConnectors",
		order: "random",
	});

	return (
		<StarknetConfig
			chains={chains}
			provider={provider}
			connectors={connectors}
		>
			{children}
		</StarknetConfig>
	);
}
