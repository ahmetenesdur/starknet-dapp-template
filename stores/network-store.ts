import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Network } from "@/types/network";

export interface NetworkState {
	network: Network;
	setNetwork: (network: Network) => void;
}

export const useNetworkStore = create<NetworkState>()(
	persist(
		(set) => ({
			network: "starknet",
			setNetwork: (network: Network) => set({ network }),
		}),
		{
			name: "network-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
