import { IUser } from 'interfaces'
import { Link } from 'react-router-dom'
import React from 'react'


interface UserLinkProps {
    user: IUser
}

export const UserLink: React.FC<UserLinkProps> = ({user}) => {
        return <Link to={`/users/${user.id}`}>u/{user.name}</Link>
}