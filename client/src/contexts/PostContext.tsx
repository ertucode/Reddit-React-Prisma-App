import React, { useContext } from 'react'
import {useParams} from "react-router-dom"
import { useAsync } from '../hooks/useAsync'
import { getPost } from '../services/posts'
import { IComment, IPost} from "../interfaces"
import { useMemo } from 'react'


interface PostProviderProps {
        children: React.ReactNode
}

interface IPostContext {
        post: IPost | undefined,
        getReplies: ((parentId: string) => any) | undefined,
        rootComments: IComment[]
}

const PostContext = React.createContext<IPostContext>({post: undefined, getReplies: undefined, rootComments: []})

export function usePost() {
        return useContext(PostContext)
}

export const PostProvider: React.FC<PostProviderProps> = ({children}) => {
        const { id } = useParams()
        const {loading, error, value: post } = useAsync<IPost>(() => getPost(id as string), [id])

        console.log(post?.comments)

        const commentsByParentId = useMemo(() => {
                if (post?.comments == null) return {};

                const group: any = {};
                post.comments.forEach(comment => {
                        group[comment.parentId] ||= []
                        group[comment.parentId].push(comment)
                })
                return group
        }, [post?.comments])

        console.log(commentsByParentId)

        function getReplies(parentId: string) {
                return commentsByParentId(parentId)
        }

        return <PostContext.Provider value={{
                post,
                getReplies,
                rootComments: commentsByParentId["a"]
        }}>
                {
                        loading && <h1>Loading</h1>
                }
                {
                        error && <h1>Error</h1>
                }
                {children}
        </PostContext.Provider>
}

