import React, { useEffect, useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { ReactComponent as DarkModeSvg } from "./dark-mode.svg";
import { ReactComponent as LightModeSvg } from "./light-mode.svg";

interface DarkModeButtonProps {}

const DARK_MODE_KEY = "REDDIT-dark";

export const DarkModeButton: React.FC<DarkModeButtonProps> = () => {
	const [darkMode, setDarkMode] = useState<boolean>();

	useEffect(() => {
		if (darkMode == null) {
			const data = localStorage.getItem(DARK_MODE_KEY);
			const dark = stringToBoolean(data);
			applyDarkModeSettingToWindow(dark);
			setDarkMode(dark);
		} else {
			localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
			applyDarkModeSettingToWindow(darkMode as boolean);
		}
	}, [darkMode]);

	return darkMode != null ? (
		<ToggleButton
			label="Dark mode"
			checked={darkMode}
			setChecked={setDarkMode}
			OnIcon={DarkModeSvg}
			OffIcon={LightModeSvg}
		/>
	) : null;
};

const stringToBoolean = (val: string | null) => {
	return val === "true";
};

const applyDarkModeSettingToWindow = (darkMode: boolean) => {
	const body = document.querySelector("body") as Element;
	if (darkMode) {
		body.classList.remove("light");
		body.classList.add("dark");
	} else {
		body.classList.remove("dark");
		body.classList.add("light");
	}
};

export const getDarkModeFromStorageAndApply = () => {
	const data = localStorage.getItem(DARK_MODE_KEY);
	const dark = stringToBoolean(data);
	applyDarkModeSettingToWindow(dark);
};
