import { useUser } from "contexts/UserContext";
import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import { getHomePagePosts } from "services/post";

export const HomePage: React.FC = () => {
	const { currentUser, loading: loadingUser } = useUser();

	return (
		<div className="main-page-container">
			{!loadingUser && currentUser ? (
				<PostListWrapper
					getter={{ callback: getHomePagePosts, params: [] }}
				/>
			) : (
				<div>Please login bro</div>
			)}
		</div>
	);
};
