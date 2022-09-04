import React, { useState } from "react";
import { ReactComponent as RedditUserIcon } from "../svg/reddit-profile.svg";
import { useUser } from "contexts/UserContext";
import { DownArrow } from "components/icons/DownArrow";
import { NavbarUserCardDropdown } from "./NavbarUserCardDropdown";

interface NavbarUserCardProps {}

export const NavbarUserCard: React.FC<NavbarUserCardProps> = () => {
	const { currentUser } = useUser();

	const [open, setOpen] = useState(false);

	const onBlurEvent = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setOpen(false);
		}
	};

	return (
		<div
			className={`navbar-item user-card ${
				open ? "expanded" : ""
			} prevent-select`}
			onClick={(e) => {
				const isChild = (e.target as HTMLElement)?.matches(
					".navbar-item.user-card .dropdown *"
				);
				const isNotExternalLink = !(e.target as HTMLElement).matches(
					"[data-option-type='external-link'], [data-option-type='external-link'] *"
				);

				if (isChild && isNotExternalLink) {
					return;
				}

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
				<DownArrow expanded={open} />
			</button>
			<NavbarUserCardDropdown open={open} />
		</div>
	);
};
