import React, { useEffect, useImperativeHandle, useState } from "react";
import "../styles/reactive-input.scss";

import { ReactComponent as TickSvg } from "../svg/tick.svg";
import { ReactComponent as ExclamationSvg } from "../svg/exclamation.svg";

interface ReactiveInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	conditions?: { cb: (val: string) => boolean; message: string }[];
}

export interface ReactiveInputRefProps {
	value: string;
	valid: boolean;
	getValue: () => undefined | string;
}

export const ReactiveInput = React.forwardRef<
	ReactiveInputRefProps,
	ReactiveInputProps
>(({ label, conditions = [], ...props }, ref) => {
	const [value, setValue] = useState<string>("");
	const [valid, setValid] = useState(true);
	const [message, setMessage] = useState("");

	useEffect(() => {
		setValid(
			conditions.every((condition) => {
				if (condition.cb(value)) {
					return true;
				}
				setMessage(`${label} ${condition.message}`);
				return false;
			})
		);
	}, [value, conditions, label]);

	useImperativeHandle(ref, () => {
		return {
			value,
			valid,
			getValue() {
				if (valid) {
					return value;
				}
				throw new Error(`Invalid input`);
			},
		};
	});

	return (
		<div className="reactive-input__container">
			<fieldset
				className={`reactive-input ${valid ? "valid" : "invalid"}`}
			>
				<input
					className="reactive-input__input"
					id={label + 1}
					{...props}
					placeholder=" "
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<label className="reactive-input__label" htmlFor={label + 1}>
					{label}
				</label>

				<div className="reactive-input__svg-container">
					{valid ? <TickSvg strokeWidth={2.5} /> : <ExclamationSvg />}
				</div>
			</fieldset>
			<p
				className="reactive-input__paragraph"
				style={valid ? { opacity: "0", pointerEvents: "none" } : {}}
			>
				{message}
			</p>
		</div>
	);
});
