import React from "react";
import { ReactComponent as UpvoteFilled } from "./svg/upvote-filled.svg";
import { ReactComponent as UpvoteEmpty } from "./svg/upvote.svg";
import { ReactComponent as DownvoteFilled } from "./svg/downvote-filled.svg";
import { ReactComponent as DownvoteEmpty } from "./svg/downvote.svg";
import { ReactComponent as Reply } from "./svg/reply.svg";
import { ReactComponent as Expand } from "./svg/expand.svg";

import "./styles/icons.scss";

const ACTIVE_RED = "#FF4500";
const ACTIVE_BLUE = "#7193FF";
const INACTIVE = "white";

interface IconButtonProps {
	Icon: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
		}
	>;
	color?: string;
	children?: JSX.Element;
	onClick?: () => void;
	className?: string;
}

interface MyButton {
	onClick?: () => void;
	className?: string;
	isActive?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
	Icon,
	color,
	children,
	onClick = () => {},
	className = "",
}) => {
	return (
		<button
			className={`icon-btn ${className}`}
			tabIndex={0}
			onClick={onClick}
			style={{ fontWeight: "inherit" }}
		>
			<Icon fill={color} />
			{children}
		</button>
	);
};

export const UpvoteButton: React.FC<MyButton> = ({ isActive, onClick }) => {
	return isActive ? (
		<IconButton
			Icon={UpvoteFilled}
			color={ACTIVE_RED}
			aria-label=" Undo like"
			onClick={onClick}
		/>
	) : (
		<IconButton
			Icon={UpvoteEmpty}
			color={ACTIVE_RED}
			aria-label="like"
			onClick={onClick}
		/>
	);
};

export const DownvoteButton: React.FC<MyButton> = ({ isActive, onClick }) => {
	return isActive ? (
		<IconButton
			Icon={DownvoteFilled}
			color={ACTIVE_BLUE}
			aria-label="Undo dislike"
			onClick={onClick}
		/>
	) : (
		<IconButton
			Icon={DownvoteEmpty}
			color={ACTIVE_BLUE}
			aria-label="dislike"
			onClick={onClick}
		/>
	);
};

export const ReplyButton: React.FC<MyButton> = ({ onClick }) => {
	return (
		<IconButton Icon={Reply} aria-label="reply" onClick={onClick}>
			<>Reply</>
		</IconButton>
	);
};

export const ExpandButton: React.FC<MyButton> = ({
	onClick,
	className = "",
}) => {
	return (
		<IconButton
			Icon={Expand}
			color={INACTIVE}
			aria-label="expand"
			onClick={onClick}
			className={className}
		/>
	);
};
