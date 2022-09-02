export type ObjectWithId<T> = T & { id: string };

export default function filterListById<T>(
	list: ObjectWithId<T>[],
	newList: ObjectWithId<T>[]
) {
	return newList.filter((n) => !list.map((l) => l.id).includes(n.id));
}
