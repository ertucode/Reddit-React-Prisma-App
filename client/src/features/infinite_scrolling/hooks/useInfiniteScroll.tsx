import { useAsyncFn } from "hooks/useAsync";
import { useCallback, useEffect, useRef, useState } from "react";

export const useInfiniteScroll = <T,>(getter: any) => {
	const [scrollIndex, setScrollIndex] = useState<number>();
	const [prevIndex, setPrevIndex] = useState<number>();
	const [isDone, setIsDone] = useState(false);
	const [data, setData] = useState<T>();

	const { loading, error, execute } = useAsyncFn(getter);

	const observer = useRef<IntersectionObserver>();
	const lastDivRef = useCallback(
		(node: HTMLDivElement) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !isDone) {
					setScrollIndex(prevIndex);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, isDone, prevIndex]
	);

	useEffect(() => {
		if (isDone) return;
		execute(scrollIndex)
			.then((data) => {
				if (data == null || data?.length === 0) {
					setIsDone(true);
					observer.current?.disconnect();
					return;
				}
				setData(data);
			})
			.catch((e) => {
				console.log(e);
			});
		// eslint-disable-next-line
	}, [scrollIndex]);

	return { loading, error, setPrevIndex, lastDivRef, data };
};
