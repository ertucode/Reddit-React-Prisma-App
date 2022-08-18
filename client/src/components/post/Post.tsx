import { usePost } from 'contexts/PostContext'
import React from 'react'
import {Comment} from "components/post/Comment"
import {Link} from "react-router-dom"

import "./styles.scss"

interface PostProps {
    
}

export const Post: React.FC<PostProps> = () => {

        const { post } = usePost()

        return ( post ? 
               <div className="post-card">
                        <section className="post-card__top-section">
                                <section className="post-card__like-section">
                                        <div>L</div>
                                        <div>{post.likes.length - post.dislikes.length}</div>
                                        <div>D</div>
                                </section>
                                <section className="post-card__right-section">
                                        <header>
                                                <Link to={`/subreddits/${post.subreddit.id}`}>r/{post.subreddit.name}</Link>
                                                <span className="sm-info">Posted by <Link to={`/users/${post.user.id}`}>u/{post.user.name}</Link> </span><div className="sm-info">{post.createdAt}</div>
                                        </header>
                                        <main>
                                                <h3>{post.title}</h3>
                                                <article>{post.body}</article> 
                                        </main>
                                </section>
                        </section>
                        <section className="post-card__new-comment">
                                <div>Create new comment</div>
                                <textarea></textarea>
                                <button>Comment</button>
                        </section>
                        <section className="post-card__comments">
                                {
                                        post.comments.map(comment => {
                                                return <Comment comment={comment}/>
                                        })
                                }
                        </section>
        </div> 
         : <div>Loading</div>
        )
}