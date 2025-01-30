import { createConfig, http } from "wagmi";
import { mainnet, scroll } from "wagmi/chains";

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}

export const config = createConfig({
	chains: [mainnet, scroll],
	multiInjectedProviderDiscovery: false,
	ssr: true,
	transports: {
		[mainnet.id]: http(
			process.env.NEXT_PUBLIC_ETH_RPC_URL || "https://rpc.ankr.com/eth"
		),
		[scroll.id]: http(
			process.env.NEXT_PUBLIC_SCROLL_RPC_URL || "https://rpc.scroll.io"
		),
	},
});
