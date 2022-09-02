import { useAsyncFn } from "hooks/useAsync";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
	const navigate = useNavigate();

	const inputRef = useRef<HTMLInputElement>(null);

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

	const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		navigate(`/search/q=${query}/type=post`);
		setOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		console.log(e);
	};

	return (
		<form
			className={`${className} search-bar `}
			onFocus={() => setOpen(true)}
			onBlur={onBlurEvent}
			onSubmit={submitHandle}
		>
			<Magnifier />
			<input
				aria-label={ariaLabel}
				value={query}
				onChange={onQueryChange}
				ref={inputRef}
				onKeyDown={(e) => handleKeyDown(e)}
			/>
			{open && (
				<SearchBarDropdown
					query={query}
					searchResults={searchResults}
					onOptionPicked={() => setOpen(false)}
					inputRef={inputRef}
				/>
			)}
		</form>
	);
};
