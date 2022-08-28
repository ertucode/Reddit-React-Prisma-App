import { useNotification } from "features/notification/contexts/NotificationProvider";
import { useAsyncFn } from "hooks/useAsync";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubreddit } from "services/subreddit";

interface SubredditFormProps {
	setOpen: (open: boolean) => void;
}

export const SubredditForm: React.FC<SubredditFormProps> = ({ setOpen }) => {
	const [subDesc, setSubDesc] = useState("");
	const [subName, setSubName] = useState("");

	const { loading, execute: createSubredditFn } = useAsyncFn(createSubreddit);

	const showNotification = useNotification();
	const navigate = useNavigate();

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (subDesc === "") return;
		if (subName === "") return;

		createSubredditFn(subName, subDesc)
			.then(() => {
				showNotification({
					type: "success",
					message: `Created r/${subName}`,
				});
				navigate(`/r/${subName}`);
			})
			.catch((e: any) => {
				showNotification({
					type: "error",
					message: `${e}`,
				});
			});
		setOpen(false);
	}

	return (
		<form className="post-form-body" onSubmit={handleSubmit}>
			<div>Create a new community</div>
			<input
				placeholder="Subreddit name"
				value={subName}
				onChange={(e) => setSubName(e.target.value)}
				autoFocus={true}
			></input>
			<textarea
				placeholder="Subreddit Description"
				value={subDesc}
				onChange={(e) => setSubDesc(e.target.value)}
			></textarea>
			<button className="generic-btn" disabled={loading} type="submit">
				{loading ? "Loading" : "Create subreddit"}
			</button>
		</form>
	);
};
