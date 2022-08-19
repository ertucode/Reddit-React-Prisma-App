import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getSubreddit } from "../services/subreddits";

interface SubredditProviderProps {
	children: React.ReactNode;
}

interface ISubredditContext {
	subreddit: ISubreddit | undefined;
}

const SubredditContext = React.createContext<ISubredditContext>({
	subreddit: undefined,
});

export function useSubreddit() {
	return useContext(SubredditContext);
}

export const SubredditProvider: React.FC<SubredditProviderProps> = ({
	children,
}) => {
	const { id } = useParams();
	const {
		loading,
		error,
		value: subreddit,
	} = useAsync<ISubreddit>(() => getSubreddit(id as string), [id]);

	return (
		<SubredditContext.Provider value={{ subreddit }}>
			{loading && <h1>Loading</h1>}
			{error && <h1>Error</h1>}
			{children}
		</SubredditContext.Provider>
	);
};
