import { useState, useCallback, useEffect } from "react";

type F<T> = (...params: any[]) => Promise<T>;

export function useAsync<T>(func: F<T>, dependencies: any[] = []) {
	const { execute, ...state } = useAsyncInternal<T>(func, dependencies, true);

	useEffect(() => {
		execute();
	}, [execute]);

	return state;
}

export function useAsyncFn<T>(func: F<T>, dependencies: any[] = []) {
	return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal<T>(
	func: F<T>,
	dependencies: any[],
	initialLoading = false
) {
	const [loading, setLoading] = useState(initialLoading);
	const [error, setError] = useState();
	const [value, setValue] = useState<T>();

	const execute: (...params: any[]) => Promise<any> = useCallback(
		async (...params) => {
			setLoading(true);

			return func(...params)
				.then((data: T) => {
					setValue(data);
					setError(undefined);
					return data;
				})
				.catch((error: any) => {
					setValue(undefined);
					setError(error);
					return Promise.reject(error);
				})
				.finally(() => {
					setLoading(false);
				});
			// eslint-disable-next-line
		},
		dependencies
	);

	return { loading, error, value, execute };
}
