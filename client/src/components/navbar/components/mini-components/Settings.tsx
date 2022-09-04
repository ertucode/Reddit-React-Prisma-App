import React, { useState } from "react";
import { ReactComponent as SettingsIcon } from "../../svg/setting.svg";
import { DarkModeButton } from "features/toggle_button/DarkModeButton";
import { DownArrow } from "components/icons/DownArrow";

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				className="dropdown__button button-with-child"
				tabIndex={0}
				aria-label="Show settings"
				onClick={() => setOpen((o) => !o)}
			>
				<SettingsIcon />

				<div className="button-with-child__button-expander">
					Settings <DownArrow expanded={open} />
				</div>
			</button>
			{open && (
				<div className="dropdown__button child">
					<div></div>
					<DarkModeButton />
				</div>
			)}
		</>
	);
};
