import React, { useCallback } from "react";
import filterListById, { ObjectWithId } from "../utils/filterListById";

export default function useSetListFromData<T>(
	list: ObjectWithId<T>[],
	setList: React.Dispatch<React.SetStateAction<ObjectWithId<T>[]>>
) {
	const setter = useCallback(
		(data: ObjectWithId<T>[] | undefined) => {
			if (data == null || data.length === 0) {
				return true;
			}
			const newList = filterListById(list, data);

			if (list.length !== 0 && newList.length === 0) {
				return true;
			}

			setList((list) => [...list, ...newList]);
			return false;
		},
		// eslint-disable-next-line
		[list]
	);
	return setter;
}
