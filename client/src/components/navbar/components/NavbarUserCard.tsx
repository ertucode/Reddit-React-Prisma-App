import React, { useState } from "react";
import { ReactComponent as DownIcon } from "../svg/down-arrow.svg";
import { ReactComponent as GenericProfileIcon } from "../svg/generic-profile.svg";
import { ReactComponent as PlusIcon } from "../svg/plus.svg";
import { ReactComponent as LogoutIcon } from "../svg/logout.svg";
import { ReactComponent as RedditUserIcon } from "../svg/reddit-profile.svg";
import { useNavigate } from "react-router-dom";
import { userLink } from "components/general/UserLink";
import { useUser } from "contexts/UserContext";
import { useAsyncFn } from "hooks/useAsync";
import { logoutUser } from "services/user";
import { SubredditForm } from "./SubredditForm";
import { Modal } from "features/modal/components/Modal";
import { useNotification } from "features/notification/contexts/NotificationProvider";

interface NavbarUserCardProps {}

export const NavbarUserCard: React.FC<NavbarUserCardProps> = () => {
	const { currentUser, changeCurrentUser } = useUser();

	const { execute: logout } = useAsyncFn(logoutUser);

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const onBlurEvent = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setOpen(false);
		}
	};

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const showNotification = useNotification();

	function onLogout() {
		logout()
			.then(() => {
				changeCurrentUser({ type: "logout" });
				showNotification({
					type: "success",
					message: "Logged out",
				});
			})
			.catch((e) => {
				console.log(e);
				showNotification({
					type: "error",
					message: "Failed to log out",
				});
			});
	}

	return (
		<div
			className={`navbar-item user-card ${
				open ? "expanded" : ""
			} prevent-select`}
			onClick={(e) => {
				if (!(e.target as HTMLDivElement).matches(".modal-overlay")) {
					setOpen((o) => !o);
				}
			}}
			onBlur={onBlurEvent}
		>
			<button className="user-card__button">
				<div>
					<RedditUserIcon />
				</div>
				<div>{currentUser!.name}</div>
				<div>{currentUser!.karma} karma</div>
				<DownIcon />
			</button>
			<div className={`dropdown ${open ? "" : "hide"}`}>
				<button
					className="dropdown__button"
					onClick={() => {
						navigate(userLink(currentUser!));
					}}
					tabIndex={0}
					aria-label="Go to your profile"
				>
					<GenericProfileIcon />
					<div>Profile</div>
				</button>
				<button
					className="dropdown__button"
					onClick={() => {
						setModalIsOpen(true);
					}}
					tabIndex={0}
					aria-label="Create subreddit"
				>
					<PlusIcon />
					<div>Create subreddit</div>
				</button>
				{modalIsOpen && (
					<Modal setOpen={setModalIsOpen}>
						<div className="post-form-modal">
							<SubredditForm setOpen={setModalIsOpen} />
						</div>
					</Modal>
				)}
				<button
					className="dropdown__button"
					onClick={onLogout}
					tabIndex={0}
					aria-label="Logout"
				>
					<LogoutIcon fill="currentcolor" />
					<div>Logout</div>
				</button>
			</div>
		</div>
	);
};
