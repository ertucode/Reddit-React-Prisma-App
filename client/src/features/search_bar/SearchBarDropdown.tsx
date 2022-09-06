import { KDiv } from "features/keyboard_interactable_div_link/KDiv";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResultType } from "./SearchBar";
import { ReactComponent as Magnifier } from "./svg/magnifier.svg";

interface SearchBarDropdownProps {
	query: string;
	searchResults: ResultType[] | undefined;
	onOptionPicked: () => void;
	onSearchMatchPicked: () => void;
	inputRef: React.RefObject<HTMLInputElement>;
}

export const SearchBarDropdown: React.FC<SearchBarDropdownProps> = ({
	query,
	searchResults,
	onOptionPicked,
	onSearchMatchPicked,
	inputRef,
}) => {
	const navigate = useNavigate();

	const onDropdownClick = (
		item: ResultType,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		switch (item.type) {
			case "Post":
				navigate(`/posts/${item.id}`);
				break;
			case "Subreddit":
				navigate(`/r/${item.name}`);
				break;
			case "User":
				navigate(`/u/${item.name}`);
				break;
			default:
				break;
		}
		onOptionPicked();
		onSearchMatchPicked();
	};

	useEffect(() => {
		function escFunction(e: KeyboardEvent) {
			if (e.key === "Escape") {
				inputRef.current?.blur();
			}
		}

		document.addEventListener("keydown", escFunction, false);

		return () => {
			document.removeEventListener("keydown", escFunction, false);
		};
	}, [inputRef]);

	return (
		<div className="search-bar__dropdown">
			{searchResults?.map((opt) => {
				return (
					<KDiv
						key={opt.id}
						className="search-bar__dropdown__option"
						onClick={(e) => onDropdownClick(opt, e)}
						aria-label={`Go to ${opt.name} which is a ${opt.type}`}
						tabIndex={0}
					>
						<div>{opt.name}</div>
						<div className="sm-info">{opt.type}</div>
					</KDiv>
				);
			})}
			<KDiv
				className="search-bar__dropdown__fallback search-bar__dropdown__option"
				tabIndex={0}
				aria-label={"Search for your query"}
				onClick={() => {
					navigate(`/search/q=${query}/type=post`);
					onOptionPicked();
				}}
			>
				<Magnifier />
				<div>Search for {query}</div>
			</KDiv>
		</div>
	);
};
