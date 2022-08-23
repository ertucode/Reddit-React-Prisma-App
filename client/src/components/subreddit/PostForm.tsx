import { useUser } from "contexts/UserContext";
import { useMultiplePosts } from "features/post_list/components/PostListWrapper";
import { useAsyncFn } from "hooks/useAsync";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createPost } from "services/post";

interface PostFormProps {}

export const PostForm: React.FC<PostFormProps> = () => {
	const { subredditName } = useParams();

	const [postBody, setPostBody] = useState("");
	const [postTitle, setPostTitle] = useState("");

	const { changeLocalPosts } = useMultiplePosts();
	const { loading, error, execute: createPostFn } = useAsyncFn(createPost);

	const { currentUser } = useUser();

	async function onPostCreate(title: string, body: string) {
		return createPostFn(subredditName, currentUser?.id, title, body).then(
			(post: IPost) => {
				// CHECK THIS
				changeLocalPosts({
					type: "create",
					payload: {
						post,
					},
				});
			}
		);
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
		<form
			className="post-card__right-section__new-postBody"
			onSubmit={handleSubmit}
		>
			<div>Create a new postBody</div>
			<input
				placeholder="Post title"
				value={postTitle}
				onChange={(e) => setPostTitle(e.target.value)}
			></input>
			<textarea
				placeholder="Post body"
				value={postBody}
				onChange={(e) => setPostBody(e.target.value)}
			></textarea>
			<button className="generic-btn" disabled={loading} type="submit">
				{loading ? "Loading" : "Post"}
			</button>
			{error && <div>{error}</div>}
		</form>
	);
};
