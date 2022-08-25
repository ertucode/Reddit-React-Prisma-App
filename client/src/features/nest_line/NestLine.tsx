import React from "react";
import "./nest-line.scss";

interface NestLineProps {
	count?: number;
}

export const NestLine: React.FC<NestLineProps> = ({ count = 1 }) => {
	const elements: JSX.Element[] = [];

	for (let i = 0; i < count; i++) {
		elements.push(<div className="nest-line" key={i}></div>);
	}

	return <>{elements}</>;
};
