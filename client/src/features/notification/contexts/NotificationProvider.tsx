import React, { useContext, useReducer } from "react";
import { v4 } from "uuid";
import Notification from "../components/Notification";

const NotificationContext = React.createContext(
	(action: NotificationReducerAction) => {}
);

const notificationReducer = (
	notifications: INotifications,
	action: NotificationReducerAction
) => {
	switch (action.type) {
		case "add":
			notifications.splice(5);
			return [action.payload, ...notifications];
		case "remove":
			return notifications.filter(
				(notification) => notification.id !== action.payload.id
			);
		default:
			return notifications;
	}
};

interface NotificationProviderProps {
	children: React.ReactNode;
}

export default function NotificationProvider({
	children,
}: NotificationProviderProps) {
	const [notifications, dispatch] = useReducer(notificationReducer, []);

	return (
		<NotificationContext.Provider value={dispatch}>
			{notifications.length !== 0 && (
				<div className="notification-wrapper">
					{notifications.map((notification) => {
						return (
							<Notification
								dispatch={dispatch}
								key={notification.id}
								notification={notification}
							/>
						);
					})}
				</div>
			)}
			{children}
		</NotificationContext.Provider>
	);
}

export const useNotification = () => {
	const dispatch = useContext(NotificationContext);

	return (props: NotificationInput) => {
		dispatch({
			type: "add",
			payload: {
				id: v4(),
				...props,
			},
		});
	};
};
