import "./styles.scss";
import { signUp } from "services/user";
import React, { useRef, useState } from "react";
import { useAsyncFn } from "hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";

export const SignUp: React.FC = () => {
	const [error, setError] = useState("");

	const nameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const passConfRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const { currentUser } = useUser();

	const { loading, execute: signUpFn } = useAsyncFn(signUp);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const name = nameRef.current!.value;
		const pass = passRef.current!.value;
		const passConf = passConfRef.current!.value;
		const email = emailRef.current!.value;

		if (pass !== passConf) {
			setError("Passwords do not match");
			return;
		}
		setError("");
		signUpFn(name, email, pass)
			.then((u) => {
				navigate("/login");
			})
			.catch((err) => {
				setError(JSON.stringify(err));
			});
	};

	if (currentUser) {
		navigate("/");
	}

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
				<label htmlFor="Password Confirmation">
					Password Confirmation
				</label>
				<input
					type="password"
					id="Password Confirmation"
					ref={passConfRef}
					required
				></input>
				<label htmlFor="Email">Email</label>
				<input type="email" id="Email" ref={emailRef} required></input>
				<button disabled={loading} type="submit">
					Create Account
				</button>
			</form>
			{loading && <div>Loading</div>}
			{error && <div>{error}</div>}
		</div>
	);
};
