import { useCallback, useRef, useState } from "react";

export const useInfiniteScroll = <T,>(
	getter: any,
	setter: (data: any) => boolean
) => {
	const [isDone, setIsDone] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>();

	const observer = useRef<IntersectionObserver>();

	const execute = useCallback(() => {
		if (loading) return;
		setLoading(true);
		getter()
			.then((data: T) => {
				if (setter(data)) {
					setIsDone(true);
				}
			})
			.catch((e: any) => {
				console.log("Wont load more due to error", e);
				setError(e);
				setIsDone(true);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [getter, setter, loading]);

	const lastDivRef = useCallback(
		(node: HTMLDivElement) => {
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !isDone) {
					execute();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isDone, execute]
	);

	const LastDiv = (
		<div ref={lastDivRef} style={{ width: "1px", height: "1px" }}></div>
	);

	return { loading, error, LastDiv, isDone };
};
