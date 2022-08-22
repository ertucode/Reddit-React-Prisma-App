import { useState } from "react";

interface CommentFormProps {
	loading: boolean;
	error: any;
	onSubmit: (comment: string) => Promise<void>;
	autoFocus?: boolean;
	initialValue?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
	loading,
	error,
	onSubmit,
	autoFocus = false,
	initialValue = "",
}) => {
	const [comment, setComment] = useState(initialValue);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (comment === "") return;
		onSubmit(comment).then(() => setComment(""));
	}

	return (
		<form
			className="post-card__right-section__new-comment"
			onSubmit={handleSubmit}
		>
			<div>Create a new comment</div>
			<textarea
				autoFocus={autoFocus}
				placeholder="What are your thoughts?"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			></textarea>
			<button className="generic-btn" disabled={loading} type="submit">
				{loading ? "Loading" : "Comment"}
			</button>
			{error && <div>{error}</div>}
		</form>
	);
};
