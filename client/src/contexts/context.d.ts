type CreateLocalCommentAction = {
	type: "create";
	payload: {
		comment: IComment;
	};
};

type UpdateLocalCommentAction = {
	type: "update";
	payload: {
		commentId: string;
		body: string;
	};
};

type DeleteLocalCommentAction = {
	type: "delete";
	payload: {
		commentId: string;
	};
};

type ToggleLocalCommentLike = {
	type: "toggle";
	payload: {
		commentId: string;
		change: ToggleCommentLikeDislike;
	};
};

type SetLocalComments = {
	type: "set";
	payload: {
		comments: IComment[];
	};
};

type SetLocalPosts = {
	type: "set";
	payload: {
		posts: IPost[];
	};
};

declare type CommentReducerAction =
	| CreateLocalCommentAction
	| UpdateLocalCommentAction
	| DeleteLocalCommentAction
	| ToggleLocalCommentLike
	| SetLocalComments;

type CreateLocalPostAction = {
	type: "create";
	payload: {
		post: IPost;
	};
};

type UpdateLocalPostAction = {
	type: "update";
	payload: {
		postId: string;
		body: string;
	};
};

type DeleteLocalPostAction = {
	type: "delete";
	payload: {
		postId: string;
	};
};

type ToggleLocalPostLike = {
	type: "toggle";
	payload: {
		postId: string;
		change: TogglePostLikeDislike;
	};
};

type SetLocalPosts = {
	type: "set";
	payload: {
		posts: IPost[];
	};
};

declare type PostReducerAction =
	| CreateLocalPostAction
	| UpdateLocalPostAction
	| DeleteLocalPostAction
	| ToggleLocalPostLike
	| setLocalPosts;
