declare interface ISubreddit {
	id: string;
	name: string;
	admins: IUser[];
	posts: IPost[];
	subscribedUsers: IUser[];
	description: string;
	_count: { subscribedUsers: number };
	subscribedByMe: boolean;
	createdAt: string;
}

declare interface IUser {
	id: string;
	name: string;
	password: string;
	email: string;
	comments: IComment[];
	likedComments: IComment[];
	likedPosts: IPost[];
	subbedTo: ISubreddit[];
	adminTo: ISubreddit[];
	posts: IPost[];
	dislikedComments: IComment[];
	dislikedPosts: IPost[];
	followedByMe: boolean;
	followedUsers: IUser[];
	_count: {
		likedComments: number;
		dislikedComments: number;
		likedPosts: number;
		dislikedPosts: number;
	};
	karma: number;
	createdAt: string;
}

declare interface IPost {
	id: string;
	title: string;
	body: string;
	comments: IComment[];
	likes: IPostLike[];
	dislikes: IPostDislike[];
	createdAt: string;
	updatedAt: string;
	subreddit: ISubreddit;
	subredditId: string;
	user: IUser;
	userId: string;
	_count: {
		likes: number;
		dislikes: number;
		comments: number;
	};
	likedByMe: -1 | 0 | 1;
}

declare interface IComment {
	id: string;
	body: string;
	user: IUser;
	userId: string;
	post: IPost;
	postId: string;
	parent: IComment;
	children: IComment[];
	parentId: string;
	createdAt: string;
	updatedAt: string;
	likes: ICommentLike[];
	dislikes: ICommentDislike[];
	_count: {
		likes: number;
		dislikes: number;
	};
	likedByMe: -1 | 0 | 1;
}

declare interface IPostLike {
	id: string;
	userId: string;
	postId: string;
}

declare interface IPostDislike {
	id: string;
	userId: string;
	postId: string;
}

declare interface ICommentLike {
	id: string;
	userId: string;
	commentId: string;
}

declare interface ICommentDislike {
	id: string;
	userId: string;
	commentId: string;
}
