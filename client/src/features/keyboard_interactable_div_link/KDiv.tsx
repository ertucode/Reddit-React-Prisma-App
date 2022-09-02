import React from "react";

interface KDivProps extends React.HTMLAttributes<HTMLDivElement> {
	onClick: (...params: any[]) => void;
}

export const KDiv: React.FC<KDivProps> = ({ onClick, ...props }) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			onClick();
		}
	};

	return (
		<div
			tabIndex={0}
			onClick={onClick}
			onKeyDown={(e) => handleKeyDown(e)}
			{...props}
		>
			{props.children}
		</div>
	);
};
