import { AllowanceTest } from "@/components/allowance-test";
import { ApproveTest } from "@/components/approve-test";
import { ConnectWallet } from "@/components/connect-wallet";

/**
 * Home page component that displays wallet connection and token approval functionality
 */
export default function Home() {
	return (
		<section className="container mx-auto flex flex-col items-center justify-center gap-8 py-8 md:py-10">
			{/* Wallet Connection Section */}
			<ConnectWallet />

			{/* Token Testing Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
				{/* Allowance Testing Section */}
				<AllowanceTest />

				{/* Approval Testing Section */}
				<ApproveTest />
			</div>
		</section>
	);
}
