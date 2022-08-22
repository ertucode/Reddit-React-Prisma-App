import React from "react";

import "app.scss";

import { SubredditList } from "components/subreddit/SubredditList";
import { SubredditProvider } from "contexts/SubredditContext";
import { Routes, Route } from "react-router-dom";
import { Subreddit } from "components/subreddit/Subreddit";
import { PostProvider } from "contexts/PostContext";
import { Post } from "components/post/Post";
import { UserPage } from "components/user_page/UserPage";
import { SignUp } from "components/sign_up/SignUp";
import { UserContextProvider } from "contexts/UserContext";
import { Login } from "components/sign_up/Login";
import { Navbar } from "components/navbar/Navbar";

function App() {
	return (
		<UserContextProvider>
			<Navbar />
			<div className="site-body">
				<Routes>
					<Route path="/" element={<SubredditList />} />
					<Route
						path="/r/:name"
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
					<Route path="/u/:name" element={<UserPage />} />
					<Route path="/sign_up" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</div>
		</UserContextProvider>
	);
}

export default App;
