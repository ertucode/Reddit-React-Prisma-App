import React from "react";

import "app.scss";

import { SubredditList } from "components/subreddit/SubredditList";
import { SubredditProvider } from "contexts/SubredditContext";
import { Routes, Route } from "react-router-dom";
import { Subreddit } from "components/subreddit/Subreddit";
import { PostProvider } from "contexts/PostContext";
import { Post } from "components/post/Post";
import { User } from "components/user/User";
import { SignUp } from "components/sign_up/SignUp";
import { UserContextProvider } from "contexts/UserContext";
import { Login } from "components/sign_up/Login";

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<SubredditList />} />
				<Route
					path="/subreddits/:id"
					element={
						<SubredditProvider>
							<Subreddit />
						</SubredditProvider>
					}
				/>
				<Route
					path="/posts/:id"
					element={
						<PostProvider>
							<Post />
						</PostProvider>
					}
				/>
				<Route path="/users/:id" element={<User />} />
				<Route path="/sign_up" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</UserContextProvider>
	);
}

export default App;
