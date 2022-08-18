import React from 'react'
import { useSubreddit } from 'contexts/SubredditContext'
import { PostList } from './PostList'

import "components/subreddit/styles.scss"

interface SubredditProps {

}

export const Subreddit: React.FC<SubredditProps> = () => {

    const { subreddit } = useSubreddit()

    subreddit?.posts.forEach(post => {
        post.subreddit = subreddit
    })

    return (
        subreddit ? 
        <>
            <h1>{subreddit.name}</h1>
            <PostList posts={subreddit.posts}/>
        </> : null
    )
}