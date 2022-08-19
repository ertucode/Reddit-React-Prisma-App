import "./styles.scss";
import { login } from "services/user";
import React, { useEffect, useRef, useState } from "react";
import { useAsyncFn } from "hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";

export const Login: React.FC = () => {
	const [error, setError] = useState("");

	const nameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const { currentUser, changeCurrentUser } = useUser();

	const { loading, execute: loginFn } = useAsyncFn(login);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const name = nameRef.current!.value;
		const pass = passRef.current!.value;

		setError("");
		loginFn(name, pass)
			.then((u) => {
				changeCurrentUser({
					type: "login",
					payload: {
						user: u,
					},
				});
			})
			.catch((err) => {
				setError(JSON.stringify(err));
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
					Login
				</button>
			</form>
			{loading && <div>Loading</div>}
			{error && <div>{error}</div>}
		</div>
	);
};
