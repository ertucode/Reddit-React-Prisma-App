type ObjectWithPosts = { posts: Post[] };
type UserWithPosts = User & ObjectWithPosts;
type SubredditWithPosts = Subreddit & ObjectWithPosts;
type ContainerWithPosts = SubredditWithPosts | UserWithPosts;

type SubredditFastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
			name: string;
		};
		Body: {
			body: string;
			parentId: string;
			title: string;
			subredditId: string;
			description: string;
		};
	}>,
	res: FastifyReply
) => void;

type SubredditRequest = Parameters<SubredditFastifyCallback>[0];
type SubredditResponse = Parameters<SubredditFastifyCallback>[1];

type UserFastifyCallback = (
	req: FastifyRequest<{
		Params: {
			id: string;
			name: string;
			tokenId: string | jwt.JwtPayload | undefined;
		};
		Body: {
			name: string;
			password: string;
			email: string;
		};
	}>,
	res: FastifyReply
) => void;

type UserRequest = Parameters<UserFastifyCallback>[0];
type UserResponse = Parameters<UserFastifyCallback>[1];

type ContainerRequest = UserRequest & SubredditRequest;
type ContainerResponse = UserResponse & SubredditResponse;

type SearchCallback = (
	req: FastifyRequest<{
		Params: {
			query: string;
			count: number;
		};
	}>,
	res: FastifyReply
) => void;

type SearchRequest = Parameters<SearchCallback>[0];

type InfiniteScrollFastifyCallback = (
	req: FastifyRequest<{
		Params: {
			query: string;
			createdAt: string;
		};
	}>,
	res: FastifyReply
) => void;

type InfiniteScrollRequest = Parameters<InfiniteScrollFastifyCallback>[0];
