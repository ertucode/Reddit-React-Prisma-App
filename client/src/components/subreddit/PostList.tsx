import { IPost } from 'interfaces'
import React from 'react'
import { SmallPost } from './SmallPost'

interface PostListProps {
        posts: IPost[]
}

export const PostList: React.FC<PostListProps> = ({posts}) => {

        return <div className="post-list">
                {posts.map(post => <SmallPost key={post.id} post={post}/>)}
        </div>
}