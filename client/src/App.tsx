import React from 'react';

import "app.scss"

import { SubredditList } from 'components/subreddit/SubredditList';
import { SubredditProvider } from 'contexts/SubredditContext';
import {Routes, Route} from "react-router-dom"
import { Subreddit } from 'components/subreddit/Subreddit';
import { PostProvider } from 'contexts/PostContext';
import { Post } from 'components/post/Post';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SubredditList />} />
      <Route path="/subreddits/:id" element={<SubredditProvider>
        <Subreddit />
      </SubredditProvider>} />
      <Route path="/posts/:id" element={<PostProvider>
        <Post />
      </PostProvider>} />
    </Routes>
  );
}

export default App;