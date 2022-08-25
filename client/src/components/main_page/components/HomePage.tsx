import { NoUserRightSide } from "components/navbar/components/NoUserRightSide";
import { useUser } from "contexts/UserContext";
import { PostListWrapper } from "features/post_list/components/PostListWrapper";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getHomePagePosts } from "services/post";

export const HomePage: React.FC = () => {
	const { currentUser, loading: loadingUser } = useUser();

	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="main-page-container" ref={ref}>
			{!loadingUser &&
				(currentUser ? (
					<PostListWrapper
						getter={{ callback: getHomePagePosts, params: [] }}
					/>
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
				className="generic-btn"
				onClick={() => navigate("/all")}
				tabIndex={0}
				aria-label="Go to all posts page"
			>
				Explore
			</button>
		</div>
	);
};
