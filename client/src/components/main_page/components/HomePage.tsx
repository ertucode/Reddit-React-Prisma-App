import { NoUserRightSide } from "components/navbar/components/NoUserRightSide";
import { useUser } from "contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { PostListWrapperWithInfiniteScroll } from "features/post_list/components/PostListWrapperWithInfiniteScroll";
import { getInfinitePosts } from "services/infiniteScroll";

export const HomePage: React.FC = () => {
	const { currentUser, loading: loadingUser } = useUser();

	const getter = useCallback(
		(createdAt: string | undefined) =>
			getInfinitePosts(createdAt, "homepage"),
		[]
	);

	return (
		<div className="main-page-container">
			{!loadingUser &&
				(currentUser ? (
					<PostListWrapperWithInfiniteScroll getter={getter} />
				) : (
					<NotLoggedHomePage />
				))}
		</div>
	);
};

const NotLoggedHomePage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="not-logged-container">
			<div>You need to be logged in to have a home page</div>
			<NoUserRightSide />
			<div>or</div>
			<button
				className="primary-btn"
				onClick={() => navigate("/all")}
				tabIndex={0}
				aria-label="Go to all posts page"
			>
				Explore
			</button>
		</div>
	);
};
