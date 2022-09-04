import React, { useState, useEffect, useCallback, useRef } from "react";
import "../styles/notification.scss";

import { ReactComponent as SuccessSvg } from "../svg/success.svg";
import { ReactComponent as ErrorSvg } from "../svg/fail.svg";

interface NotificationPropTypes {
	dispatch: React.Dispatch<NotificationReducerAction>;
	notification: INotification;
}

export default function Notification({
	dispatch,
	notification,
}: NotificationPropTypes) {
	const [width, setWidth] = useState(100);
	const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
	const itemRef = useRef<HTMLDivElement>(null);

	const handleStartTimer = useCallback(() => {
		const timeToWait = notification.time || 3000 / 200;
		const id = setInterval(() => {
			setWidth((prev) => {
				if (prev > 0) {
					return prev - 0.5;
				}

				clearInterval(id);
				return prev;
			});
		}, timeToWait);

		setIntervalID(id);
	}, [notification]);

	useEffect(() => {
		setTimeout(() => itemRef.current?.classList.add("show"), 200);
	}, []);

	useEffect(() => {
		setTimeout(() => handleStartTimer(), 400);
	}, [handleStartTimer]);

	const handlePauseTimer = useCallback(() => {
		clearInterval(intervalID);
	}, [intervalID]);

	const handleCloseNotification = useCallback(() => {
		handlePauseTimer();
		itemRef.current?.classList.remove("show");
		setTimeout(() => {
			dispatch({
				type: "remove",
				payload: {
					id: notification.id,
				},
			});
		}, 400);
	}, [handlePauseTimer, notification, dispatch]);

	useEffect(() => {
		if (width === 0) {
			// Close notification
			handleCloseNotification();
		}
	}, [width, handleCloseNotification]);

	return (
		<div
			ref={itemRef}
			onMouseEnter={handlePauseTimer}
			onMouseLeave={handleStartTimer}
			onClick={handleCloseNotification}
			className={`notification-item ${notification.type}`}
		>
			<p>
				{loadSvg(notification.type)}
				{notification.message}
			</p>
		</div>
	);
}

function loadSvg(type: NotificationTypes) {
	switch (type) {
		case "success":
			return <SuccessSvg fill="white" stroke="green" strokeWidth="0" />;
		case "error":
			return <ErrorSvg fill="white" stroke="red" strokeWidth="0" />;
		default:
			return <SuccessSvg fill="white" stroke="green" strokeWidth="0" />;
	}
}
