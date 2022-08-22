import React, { useState } from "react";
import "./styles.scss";
import { ReactComponent as Magnifier } from "./svg/magnifier.svg";

interface SearchBarProps {
	className?: string;
	ariaLabel: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
	ariaLabel,
	className = "",
}) => {
	const [focusState, setFocusState] = useState(false);

	return (
		<form
			className={`${className} search-bar ${focusState ? "focus" : ""}`}
		>
			<Magnifier />
			<input
				onFocus={() => setFocusState(true)}
				onBlur={() => setFocusState(false)}
				aria-label={ariaLabel}
			/>
		</form>
	);
};
