import { getSubreddits } from "../../services/subreddits";

import { Link } from "react-router-dom";

import { useAsync } from "../../hooks/useAsync";

export const SubredditList: React.FC = () => {
	const {
		loading,
		error,
		value: subreddits,
	} = useAsync<ISubreddit[]>(getSubreddits);

	if (loading) return <h1>Loading</h1>;
	if (error) return <h1>{error}</h1>;

	return (
		<>
			{(subreddits as ISubreddit[]).map((subreddit) => {
				return (
					<h1 key={subreddit.id}>
						<Link to={`/subreddits/${subreddit.id}`}>
							{subreddit.name}
						</Link>
					</h1>
				);
			})}
		</>
	);
};
