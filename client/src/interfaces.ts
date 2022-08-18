

export interface ISubreddit {
    id: string,
    name: string,
    admins: [],
    posts: IPost[],
    subscribedUsers: IUser[]
}

export interface IUser {
    id: string,
    name: string,
    password: string,
    email: string,
    comments: IComment[],
    likedComments: IComment[],
    likedPosts: IPost[],
    subbedTo: ISubreddit[],
    adminTo: ISubreddit[]
    posts: IPost[],
    dislikedComments: IComment[],
    dislikedPosts: IPost[]
}

export interface IPost {
    id: string,
    title: string,
    body: string,
    comments: IComment[],
    likes: IPostLike[]
    dislikes: IPostDislike[],
    createdAt: string,
    updatedAt: string,
    subreddit: ISubreddit,
    subredditId: string,
    user: IUser,
    userId: string
}


export interface IComment {
    id: string,
    body: string,
    user: IUser,
    userId: string,
    post: IPost,
    postId: string,
    parent: IComment,
    children: IComment[],
    parentId: string,
    createdAt: string,
    updatedAt: string,
    likes: ICommentLike[],
    dislikes: ICommentDislike[],
}

export interface IPostLike {
    id: string,
    userId: string,
    postId: string
}

export interface IPostDislike {
    id: string,
    userId: string,
    postId: string
}

export interface ICommentLike {
    id: string,
    userId: string,
    commentId: string
}

export interface ICommentDislike {
    id: string,
    userId: string,
    commentId: string
}
