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

declare type CommentReducerAction =
	| CreateLocalCommentAction
	| UpdateLocalCommentAction
	| DeleteLocalCommentAction
	| ToggleLocalCommentLike
	| SetLocalComments;
