import "./styles.scss";
import { login } from "services/user";
import React, { useEffect, useRef } from "react";
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

export const Login: React.FC = () => {
	const nameRef = useRef<ReactiveInputRefProps>(null);
	const passRef = useRef<ReactivePasswordInputRefProps>(null);

	const navigate = useNavigate();

	const { currentUser, changeCurrentUser } = useUser();

	const { loading, execute: loginFn } = useAsyncFn(login);

	const showNotification = useNotification();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const name = nameRef.current!.getValue();
			const pass = passRef.current!.getValue();

			loginFn(name, pass)
				.then((u) => {
					changeCurrentUser({
						type: "login",
						payload: {
							user: u,
						},
					});
					showNotification({
						type: "success",
						message: "Logged in",
					});
				})
				.catch((err) => {
					showNotification({
						type: "error",
						message: `Failed to login (${err})`,
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

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	});

	return (
		<>
			<div className="sign-up">
				<form onSubmit={onSubmit}>
					<ReactiveInput
						label="Name"
						ref={nameRef}
						conditions={nameConditions}
						required
					></ReactiveInput>
					<ReactivePasswordInput
						label="Password"
						ref={passRef}
						required
					></ReactivePasswordInput>
					<button
						disabled={loading}
						type="submit"
						className="primary-btn"
					>
						{loading ? "Loading" : "Login"}
					</button>
				</form>
			</div>
		</>
	);
};
