import React from "react";

import "styles/app.scss";

import { Routes, Route } from "react-router-dom";
import { Subreddit } from "components/subreddit/Subreddit";
import { PostProvider } from "contexts/PostContext";
import { Post } from "components/post/Post";
import { UserPage } from "components/user_page/UserPage";
import { SignUp } from "components/sign_up/SignUp";
import { UserContextProvider } from "contexts/UserContext";
import { Login } from "components/sign_up/Login";
import { Navbar } from "components/navbar/Navbar";
import { MainPage } from "components/main_page/MainPage";
import { SearchPage } from "features/search_page/components/SearchPage";
import { ModalContextProvider } from "features/modal/contexts/ModalContext";

function App() {
	return (
		<UserContextProvider>
			<ModalContextProvider>
				<Navbar />
				<div className="site-body">
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route
							path="/r/:subredditName"
							element={<Subreddit />}
						/>
						<Route
							path="/posts/:id"
							element={
								<PostProvider>
									<Post />
								</PostProvider>
							}
						/>
						<Route path="/u/:userName" element={<UserPage />} />
						<Route path="/sign_up" element={<SignUp />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/search/q=:query/type=:type"
							element={<SearchPage />}
						/>
						<Route
							path="/search/q=/type=:type"
							element={<SearchPage />}
						/>
						<Route path="*" element={<h1>Invalid URL</h1>} />
					</Routes>
				</div>
			</ModalContextProvider>
		</UserContextProvider>
	);
}

export default App;
