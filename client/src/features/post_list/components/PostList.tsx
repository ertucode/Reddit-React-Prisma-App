import { SmallPost } from "./SmallPost";
import React from "react";
import "./styles.scss";
import { DownvoteButton, UpvoteButton } from "components/icons/icons";

interface PostListProps {
	posts: IPost[] | undefined;
	changeLocalPosts: React.Dispatch<any>;
	mini?: boolean;
	loading: boolean;
	error: any;
}

export const PostList: React.FC<PostListProps> = ({
	posts,
	mini = false,
	changeLocalPosts,
	loading,
	error,
}) => {
	error && console.log(error);
	return (
		<>
			<div className="post-list">
				{posts &&
					posts.length > 0 &&
					posts.map((post) => (
						<SmallPost
							key={post.id}
							post={post}
							mini={mini}
							changeLocalPosts={changeLocalPosts}
						/>
					))}
			</div>
			{!loading && posts?.length === 0 && (
				<div>Looks like there are no posts here..</div>
			)}

			{loading && <PlaceholderPostList />}
		</>
	);
};

export const PlaceholderPostList: React.FC = () => {
	const posts = [];
	for (let i = 0; i < 2; i++) {
		posts.push(<PlaceholderPost key={i} />);
	}

	return (
		<div className="post-list" id="placeholder">
			{posts}
		</div>
	);
};

const PlaceholderPost: React.FC = () => {
	return (
		<div className="small-post">
			<section className="small-post__like-section">
				<UpvoteButton isActive={false} />
				<div></div>
				<DownvoteButton isActive={false} />
			</section>
			<section id="placeholder__right">
				<div id="placeholder__right-header"></div>
				<div id="placeholder__right-body"></div>
				<div id="placeholder__right-footer"></div>
			</section>
		</div>
	);
};
