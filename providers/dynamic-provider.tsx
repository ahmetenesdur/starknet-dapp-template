"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ReactNode } from "react";
import useSystemTheme from "@/hooks/useSystemTheme";
import { useNetworkStore } from "@/stores/network-store";
import {
	DynamicContextProvider,
	DynamicWagmiConnector,
	EthereumWalletConnectors,
	FilterChain,
	StarknetWalletConnectors,
} from "@/lib/dynamic";
import { config } from "@/lib/wagmi";
import { siteConfig } from "@/config/site";

/**
 * Props for the DynamicProvider component
 */
interface DynamicProviderProps {
	children: ReactNode;
}

// Initialize React Query client
const queryClient = new QueryClient();

/**
 * DynamicProvider component that handles wallet connections and authentication
 * Provides wallet connection functionality for both EVM and Starknet chains
 */
export function DynamicProvider({ children }: DynamicProviderProps) {
	const { network } = useNetworkStore();
	const theme = useSystemTheme();

	return (
		<DynamicContextProvider
			theme={theme === "light" || theme === "dark" ? theme : "dark"}
			settings={{
				environmentId:
					process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
				walletConnectors: [
					StarknetWalletConnectors,
					EthereumWalletConnectors,
				],

				initialAuthenticationMode: "connect-only",
				privacyPolicyUrl: siteConfig.links.privacyPolicy,
				termsOfServiceUrl: siteConfig.links.termsOfService,
				walletsFilter:
					network === "starknet"
						? FilterChain("STARK")
						: FilterChain("EVM"),
			}}
		>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<DynamicWagmiConnector>{children}</DynamicWagmiConnector>
				</QueryClientProvider>
			</WagmiProvider>
		</DynamicContextProvider>
	);
}
