import { useUser } from "contexts/UserContext";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import { useAsyncFn } from "hooks/useAsync";
import { useState } from "react";
import { createPost } from "services/post";

interface PostFormProps {
	subredditName: string;
	changeLocalPosts: (action: any) => void;
}

export const PostForm: React.FC<PostFormProps> = ({
	subredditName,
	changeLocalPosts,
}) => {
	const [postBody, setPostBody] = useState("");
	const [postTitle, setPostTitle] = useState("");

	const showNotification = useNotification();

	const { loading, error, execute: createPostFn } = useAsyncFn(createPost);

	const { currentUser } = useUser();

	async function onPostCreate(title: string, body: string) {
		return createPostFn(subredditName, currentUser?.id, title, body)
			.then((post: IPost) => {
				// CHECK THIS
				changeLocalPosts({
					type: "create",
					payload: {
						post,
					},
				});
				showNotification({
					type: "success",
					message: "Created a post",
				});
			})
			.catch((e) => {
				showNotification({
					type: "error",
					message: "Failed to create a post",
				});
				console.log(e);
			});
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (postBody === "") return;
		if (postTitle === "") return;

		onPostCreate(postTitle, postBody).then(() => {
			setPostBody("");
			setPostTitle("");
		});
	}

	return (
		<form className="post-form-body" onSubmit={handleSubmit}>
			<div>Create a new post</div>
			<input
				placeholder="Post title"
				value={postTitle}
				onChange={(e) => setPostTitle(e.target.value)}
				autoFocus={true}
			></input>
			<textarea
				placeholder="Post body"
				value={postBody}
				onChange={(e) => setPostBody(e.target.value)}
			></textarea>
			<button className="primary-btn" disabled={loading} type="submit">
				{loading ? "Loading" : "Post"}
			</button>
			{error && <div>{error}</div>}
		</form>
	);
};
