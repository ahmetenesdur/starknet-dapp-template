"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/system";

import { DynamicProvider } from "@/providers/dynamic-provider";
import StarknetProvider from "@/providers/starknet-provider";

/**
 * Props for the Providers component
 */
interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

/**
 * Root provider component that wraps the application with necessary context providers
 * Includes:
 * - HeroUI for UI components
 * - Next-themes for theme management
 * - Dynamic for wallet connection
 * - Starknet for blockchain interaction
 */
export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	return (
		<HeroUIProvider navigate={router.push}>
			{/* Theme provider for dark/light mode */}
			<NextThemesProvider {...themeProps}>
				{/* Dynamic provider */}
				<DynamicProvider>
					{/* Starknet-react provider */}
					<StarknetProvider>{children}</StarknetProvider>
				</DynamicProvider>
			</NextThemesProvider>
		</HeroUIProvider>
	);
}
