import { IPost } from 'interfaces'
import React from 'react'
import {Link} from "react-router-dom"

interface SmallPostProps {
        post: IPost
}

export const SmallPost: React.FC<SmallPostProps> = ({post}) => {
        return (<div className="small-post">
                        <section className="small-post__like-section">
                                <div>L</div>
                                <div>{post.likes.length - post.dislikes.length}</div>
                                <div>D</div>
                        </section>
                        <section>
                                <header>
                                        <Link to={`/subreddits/${post.subreddit.id}`}>r/{post.subreddit.name}</Link>
                                        <span className="sm-info">Posted by <Link to={`/users/${post.user.id}`}>u/{post.user.name}</Link> </span><div className="sm-info">{post.createdAt}</div>
                                </header>
                                <main>
                                        <Link to={`/posts/${post.id}`}>
                                                <h3>{post.title}</h3>
                                                <article>{post.body}</article>
                                        </Link>
                                </main>
                        </section>
        </div>)
}