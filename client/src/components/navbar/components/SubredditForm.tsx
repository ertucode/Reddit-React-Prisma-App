import { useAsyncFn } from "hooks/useAsync";
import React, { useState } from "react";
import { createSubreddit } from "services/subreddit";

interface SubredditFormProps {}

export const SubredditForm: React.FC<SubredditFormProps> = () => {
	const [subDesc, setSubDesc] = useState("");
	const [subName, setSubName] = useState("");

	const {
		loading,
		error,
		execute: createSubredditFn,
	} = useAsyncFn(createSubreddit);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (subDesc === "") return;
		if (subName === "") return;

		createSubredditFn(subName, subDesc)
			.then(() => {
				// Created notification
			})
			.catch((e: any) => {
				console.log(e);
			});
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
			{error && <div>{error}</div>}
		</form>
	);
};
