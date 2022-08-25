import { useModal } from "features/modal/contexts/ModalContext";
import { useMultiplePosts } from "features/post_list/components/PostListWrapper";
import React from "react";
import { useParams } from "react-router-dom";
import { PostForm } from "./PostForm";

export const MockForm: React.FC = () => {
	const { setModalOpen, setModalChildren, setModalClassName } = useModal();
	const { subredditName } = useParams();
	const { changeLocalPosts } = useMultiplePosts();

	return (
		<div className="mock-form">
			<input
				placeholder="Create Post"
				aria-label="Click to create a post"
				onClick={(e) => {
					setModalOpen(true);
					setModalChildren(
						<PostForm
							subredditName={subredditName || ""}
							changeLocalPosts={(action: any) => {
								setModalOpen(false);
								changeLocalPosts(action);
							}}
						/>
					);
					setModalClassName("post-form-modal");
					e.currentTarget.blur();
				}}
			></input>
		</div>
	);
};
