import "./styles.scss";
import { signUp } from "services/user";
import React, { useRef, useState } from "react";
import { useAsyncFn } from "hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import {
	ReactiveInput,
	ReactiveInputRefProps,
} from "features/reactive_form_items/components/ReactiveInput";
import {
	ReactivePasswordInput,
	ReactivePasswordInputRefProps,
} from "features/reactive_form_items/components/ReactivePasswordInput";

const nameConditions = [
	{
		cb: (value: string) => value.length > 4,
		message: "must be longer than 4 characters",
	},
];

const emailConditions = [
	{
		cb: (value: string) =>
			value.search(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/
			) > -1,
		message: "must be valid",
	},
];

const passwordConditions = [
	{
		cb: (value: string) => value.length > 8,
		message: "must be longer than 8 characters",
	},
	{
		cb: (value: string) => value.search(/[A-Z]/) > -1,
		message: "must contain an uppercase letter",
	},
	{
		cb: (value: string) => value.search(/[a-z]/) > -1,
		message: "must contain a lowercase letter",
	},
	{
		cb: (value: string) => value.search(/[$&+,:;=?@#]/) > -1,
		message: "must contain a special character ($&+,:;=?@#)",
	},
];

export const SignUp: React.FC = () => {
	const nameRef = useRef<ReactiveInputRefProps>(null);
	const passRef = useRef<ReactivePasswordInputRefProps>(null);
	const passConfRef = useRef<ReactivePasswordInputRefProps>(null);
	const emailRef = useRef<ReactiveInputRefProps>(null);

	const [passVal, setPassVal] = useState("");

	const navigate = useNavigate();

	const { currentUser } = useUser();

	const { loading, execute: signUpFn } = useAsyncFn(signUp);

	const showNotification = useNotification();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const name = nameRef.current!.getValue();
			const pass = passRef.current!.getValue();
			const passConf = passConfRef.current!.getValue();
			const email = emailRef.current!.getValue();

			if (pass !== passConf) {
				showNotification({
					type: "error",
					message: "Passwords do not match",
					time: 4000,
				});
				return;
			}
			signUpFn(name, email, pass)
				.then((u) => {
					navigate("/login");
					showNotification({
						type: "success",
						message: "Signed up",
					});
				})
				.catch((err) => {
					showNotification({
						type: "error",
						message: `Failed to login (${err})`,
						time: 5000,
					});
					console.log(err);
				});
		} catch (e: any) {
			if (e?.message === "Invalid input") {
				showNotification({
					type: "error",
					message: "Invalid input",
				});
			} else {
				console.log(e);
			}
		}
	};

	if (currentUser) {
		navigate("/");
	}

	const passwordConfirmationValidityConditions = [
		{
			cb: (value: string) => value === passVal,
			message: "must match the password",
		},
	];

	return (
		<div className="sign-up">
			<form onSubmit={onSubmit}>
				<ReactiveInput
					label="Name"
					ref={nameRef}
					required
					conditions={nameConditions}
				></ReactiveInput>

				<ReactivePasswordInput
					type="password"
					label="Password"
					ref={passRef}
					required
					conditions={passwordConditions}
					onChange={(e) => setPassVal(e.target.value)}
				></ReactivePasswordInput>

				<ReactivePasswordInput
					type="password"
					label="Password Confirmation"
					ref={passConfRef}
					conditions={passwordConfirmationValidityConditions}
					required
				></ReactivePasswordInput>
				<ReactiveInput
					type="email"
					label="Email"
					ref={emailRef}
					conditions={emailConditions}
					required
				></ReactiveInput>
				<button
					disabled={loading}
					type="submit"
					className="primary-btn"
				>
					{loading ? "Loading" : "Create Account"}
				</button>
			</form>
		</div>
	);
};
