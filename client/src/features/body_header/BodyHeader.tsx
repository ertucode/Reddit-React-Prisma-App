import React from "react";
import "./body-header.scss";

interface BodyHeaderProps {
	header: string;
	bottomChildren?: React.ReactNode;
	rightChildren?: React.ReactNode;
}

export const BodyHeader: React.FC<BodyHeaderProps> = ({
	header,
	bottomChildren,
	rightChildren,
}) => {
	return (
		<div className="body-header">
			<div>
				<div className="body-header__top">
					<h1>{header}</h1>
					<div className="body-header__top-right">
						{rightChildren}
					</div>
				</div>
				<div className="body-header__bottom">{bottomChildren}</div>
			</div>
		</div>
	);
};
