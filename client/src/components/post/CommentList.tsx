import { IComment } from 'interfaces';
import React from 'react'
import { Comment } from './Comment';

interface CommentListProps {
    comments: IComment[]
}

export const CommentList: React.FC<CommentListProps> = ({comments}) => {
        return <div className="comment-list">
            {
                comments.map(comment => {
                    return <Comment key={comment.id} comment={comment} />
                })
            }
        </div>
}