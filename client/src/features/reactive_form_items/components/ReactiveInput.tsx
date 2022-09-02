import React from "react";

interface ReactiveInputProps extends React.HTMLAttributes<HTMLInputElement> {}

export const ReactiveInput: React.FC<ReactiveInputProps> = ({ ...props }) => {
	return <input {...props}>ReactiveInput</input>;
};
