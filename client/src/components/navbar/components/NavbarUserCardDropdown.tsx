import { userLink } from "components/general/UserLink";
import { useUser } from "contexts/UserContext";
import { useNotification } from "features/notification/contexts/NotificationProvider";
import { useAsyncFn } from "hooks/useAsync";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "services/user";

import { SubredditForm } from "./SubredditForm";
import { Modal } from "features/modal/components/Modal";
import { ReactComponent as GenericProfileIcon } from "../svg/generic-profile.svg";
import { ReactComponent as PlusIcon } from "../svg/plus.svg";
import { ReactComponent as LogoutIcon } from "../svg/logout.svg";
import { Settings } from "./mini-components/Settings";

interface NavbarUserCardDropdownProps {
	open: boolean;
}

export const NavbarUserCardDropdown: React.FC<NavbarUserCardDropdownProps> = ({
	open,
}) => {
	const { currentUser, changeCurrentUser } = useUser();
	const navigate = useNavigate();
	const { execute: logout } = useAsyncFn(logoutUser);

	const [modalIsOpen, setModalIsOpen] = useState(false);

	const showNotification = useNotification();

	function onLogout() {
		logout()
			.then(() => {
				window.location.reload();
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
		<div className={`dropdown ${open ? "" : "hide"}`}>
			<button
				className="dropdown__button"
				data-option-type="external-link"
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
				data-option-type="external-link"
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
			<Settings />

			<button
				className="dropdown__button"
				data-option-type="external-link"
				onClick={onLogout}
				tabIndex={0}
				aria-label="Logout"
			>
				<LogoutIcon fill="currentcolor" />
				<div>Logout</div>
			</button>
		</div>
	);
};
