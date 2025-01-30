import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

const useSystemTheme = (): "light" | "dark" => {
	const { theme: nextTheme, resolvedTheme } = useTheme();
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		if (nextTheme === "system" && resolvedTheme) {
			setTheme(resolvedTheme as "light" | "dark");
		} else if (nextTheme) {
			setTheme(nextTheme as "light" | "dark");
		}
	}, [nextTheme, resolvedTheme]);

	return theme;
};

export default useSystemTheme;
