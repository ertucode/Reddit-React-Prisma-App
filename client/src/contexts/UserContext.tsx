import { useAsync } from "hooks/useAsync";
import React, { useContext, useEffect, useReducer } from "react";
import { getUserFromCookie } from "services/user";

interface UserContextProps {
	children: React.ReactNode;
}

type UserReducerAction =
	| {
			type: "login";
			payload: {
				user: any;
			};
	  }
	| {
			type: "logout";
			payload: {
				userId: string;
			};
	  };

function userReducer(user: IUser | undefined, action: UserReducerAction) {
	switch (action.type) {
		case "login":
			return action.payload.user;
		case "logout":
			return undefined;
		default:
			return user;
	}
}

interface IUserContext {
	currentUser: IUser | undefined;
	changeCurrentUser: (action: any) => void;
	loading: boolean;
	error: any;
}

const initialContextValue = {
	currentUser: undefined,
	changeCurrentUser: () => {},
	loading: true,
	error: undefined,
};

const UserContext = React.createContext<IUserContext>(initialContextValue);

export const UserContextProvider: React.FC<UserContextProps> = ({
	children,
}) => {
	const [currentUser, changeCurrentUser] = useReducer(userReducer, undefined);
	const { loading, error, value: user } = useAsync<IUser>(getUserFromCookie);

	useEffect(() => {
		if (user) {
			changeCurrentUser({
				type: "login",
				payload: {
					user,
				},
			});
		}
	}, [user]);

	return (
		<UserContext.Provider
			value={{ currentUser, changeCurrentUser, loading, error }}
		>
			{children}
		</UserContext.Provider>
	);
};

export function useUser() {
	return useContext(UserContext);
}
