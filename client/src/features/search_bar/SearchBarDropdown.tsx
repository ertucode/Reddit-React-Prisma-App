import React from "react";
import { useNavigate } from "react-router-dom";
import { ResultType } from "./SearchBar";
import { ReactComponent as Magnifier } from "./svg/magnifier.svg";

interface SearchBarDropdownProps {
	query: string;
	searchResults: ResultType[] | undefined;
	onOptionPicked: () => void;
}

export const SearchBarDropdown: React.FC<SearchBarDropdownProps> = ({
	query,
	searchResults,
	onOptionPicked,
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
	};

	return (
		<div className="search-bar__dropdown">
			{searchResults?.map((opt) => {
				return (
					<div
						key={opt.id}
						className="search-bar__dropdown__option"
						onClick={(e) => onDropdownClick(opt, e)}
						aria-label={`Go to ${opt.name} which is a ${opt.type}`}
						tabIndex={0}
					>
						<div>{opt.name}</div>
						<div className="sm-info">{opt.type}</div>
					</div>
				);
			})}
			<div
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
			</div>
		</div>
	);
};
