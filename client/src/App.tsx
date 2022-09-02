import React from "react";

import "styles/app.scss";

import { Routes, Route } from "react-router-dom";
import { Subreddit } from "components/subreddit/Subreddit";
import { PostProvider } from "contexts/PostContext";
import { Post } from "components/post/Post";
import { UserPage } from "components/user_page/components/UserPage";
import { SignUp } from "components/sign_up/SignUp";
import { UserContextProvider } from "contexts/UserContext";
import { Login } from "components/sign_up/Login";
import { Navbar } from "components/navbar/components/Navbar";
import { AllPage } from "components/main_page/components/AllPage";
import { SearchPage } from "features/search_page/components/SearchPage";
import { HomePage } from "components/main_page/components/HomePage";
import NotificationProvider from "features/notification/contexts/NotificationProvider";
import { ScrollToTopButton } from "features/scroll_to_top_button/ScrollToTopButton";

function App() {
	return (
		<>
			<UserContextProvider>
				<NotificationProvider>
					<Navbar />
					<div className="site-body">
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/all" element={<AllPage />} />
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
							<Route
								path="/u/:userName/:type"
								element={<UserPage />}
							/>
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
				</NotificationProvider>
			</UserContextProvider>
			<ScrollToTopButton />
		</>
	);
}

export default App;
