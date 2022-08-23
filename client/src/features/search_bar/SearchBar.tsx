import React from "react";
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
	return (
		<form className={`${className} search-bar `}>
			<Magnifier />
			<input aria-label={ariaLabel} />
		</form>
	);
};
