import { getSubreddits } from "../../services/subreddit";

import { useAsync } from "../../hooks/useAsync";
import { SubredditLink } from "components/general/SubredditLink";

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
						<SubredditLink subreddit={subreddit} />
					</h1>
				);
			})}
		</>
	);
};
