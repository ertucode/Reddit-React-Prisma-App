import React from "react";
import "./styles/down-arrow.scss";
import { ReactComponent as DownIcon } from "./svg/down-arrow.svg";

interface DownArrowProps {
	expanded: boolean;
}

export const DownArrow: React.FC<DownArrowProps> = ({ expanded }) => {
	return (
		<DownIcon className={expanded ? "expanded down-arrow" : "down-arrow"} />
	);
};
