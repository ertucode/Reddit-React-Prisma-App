import { IComment } from 'interfaces'
import React from 'react'

interface CommentProps {
    comment: IComment
}

export const Comment: React.FC<CommentProps> = ({comment}) => {
        return <div>{comment.body}</div>
}