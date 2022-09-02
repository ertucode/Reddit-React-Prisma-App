import "./styles.scss";
import { login } from "services/user";
import React, { useEffect, useRef } from "react";
import { useAsyncFn } from "hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { useNotification } from "features/notification/contexts/NotificationProvider";

export const Login: React.FC = () => {
	const nameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const { currentUser, changeCurrentUser } = useUser();

	const { loading, execute: loginFn } = useAsyncFn(login);

	const showNotification = useNotification();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const name = nameRef.current!.value;
		const pass = passRef.current!.value;

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
	};

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	});

	return (
		<div className="sign-up">
			<form onSubmit={onSubmit}>
				<label htmlFor="Name">Name</label>
				<input id="Name" ref={nameRef} required></input>
				<label htmlFor="Password">Password</label>
				<input
					type="password"
					id="Password"
					ref={passRef}
					required
				></input>
				<button disabled={loading} type="submit">
					{loading ? "Loading" : "Login"}
				</button>
			</form>
		</div>
	);
};
