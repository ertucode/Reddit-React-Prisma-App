type NotificationTypes = "success" | "error";

interface INotifications extends Array<INotification> {}

interface INotification {
	id: string;
	type: NotificationTypes;
	message: string;
	time?: number;
}

type NotificationInput = Omit<INotification, "id">;

type NotificationReducerAction =
	| { type: "add"; payload: INotification }
	| { type: "remove"; payload: { id: string } };
