import React from "react";
import "./toggle-btn.scss";

interface ToggleButtonProps {
	OnIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	OffIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	label: string;
	initialState?: boolean;
	checked: boolean;
	setChecked: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
	OnIcon = null,
	OffIcon = null,
	label,
	checked,
	setChecked,
	initialState = false,
}) => {
	return (
		<button
			className="toggle-btn__container"
			type="button"
			onClick={() => setChecked((c) => !c)}
		>
			<div>{label}</div>
			<div className="toggle-btn">
				<div
					className={`toggle-btn__cursor ${checked ? "checked" : ""}`}
				>
					{checked ? OnIcon && <OnIcon /> : OffIcon && <OffIcon />}
				</div>
			</div>
		</button>
	);
};
