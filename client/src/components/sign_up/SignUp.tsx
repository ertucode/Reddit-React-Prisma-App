import "./styles.scss";
import { signUp } from "services/user";
import React, { useRef } from "react";
import { useAsyncFn } from "hooks/useAsync";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { useNotification } from "features/notification/contexts/NotificationProvider";

export const SignUp: React.FC = () => {
	const nameRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const passConfRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const { currentUser } = useUser();

	const { loading, execute: signUpFn } = useAsyncFn(signUp);

	const showNotification = useNotification();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const name = nameRef.current!.value;
		const pass = passRef.current!.value;
		const passConf = passConfRef.current!.value;
		const email = emailRef.current!.value;

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
					{loading ? "Loading" : "Create Account"}
				</button>
			</form>
		</div>
	);
};
