import { useAsyncFn } from "hooks/useAsync";
import React, { useState } from "react";
import { searchEverything } from "services/search";
import { SearchBarDropdown } from "./SearchBarDropdown";
import "./styles.scss";
import { ReactComponent as Magnifier } from "./svg/magnifier.svg";

interface SearchBarProps {
	className?: string;
	ariaLabel: string;
}

const NUMBER_OF_ITEMS = 5;
export type ResultType = {
	name: string;
	type: "Subreddit" | "Post" | "User";
	id: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({
	ariaLabel,
	className = "",
}) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState<ResultType[]>();

	const { execute: searchEverythingFn } =
		useAsyncFn<ResultType[]>(searchEverything);

	const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const q = e.target.value;
		setQuery(q);

		searchEverythingFn(q, NUMBER_OF_ITEMS)
			.then((results) => {
				setSearchResults(results);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const onBlurEvent = (e: React.FocusEvent<HTMLFormElement, Element>) => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setOpen(false);
		}
	};

	return (
		<form
			className={`${className} search-bar `}
			onFocus={() => setOpen(true)}
			onBlur={onBlurEvent}
		>
			<Magnifier />
			<input
				aria-label={ariaLabel}
				value={query}
				onChange={onQueryChange}
			/>
			{open && (
				<SearchBarDropdown
					query={query}
					searchResults={searchResults}
					onOptionPicked={() => setOpen(false)}
				/>
			)}
		</form>
	);
};
