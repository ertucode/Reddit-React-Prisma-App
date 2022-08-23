import React from "react";
import "./styles.scss";

interface BodyHeaderProps {
	header: string;
}

export const BodyHeader: React.FC<BodyHeaderProps> = ({ header }) => {
	return (
		<div className="body-header">
			<div>
				<h1>{header}</h1>
			</div>
		</div>
	);
};
