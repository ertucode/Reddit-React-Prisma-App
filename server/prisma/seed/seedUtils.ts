import { Prisma } from "@prisma/client";
import axios from "axios";

type PrismaUserCreateArgs = Prisma.XOR<
	Prisma.UserCreateInput,
	Prisma.UserUncheckedCreateInput
>;

export async function fetchRandomWords(count: number) {
	const data = await axios.get(
		`https://random-word-api.herokuapp.com/word?number=${count}`
	);
	const words: Dictionary = data.data;
	return words;
}

export function getRandomWordFromDictionary(dictionary: Dictionary) {
	return dictionary[Math.floor(Math.random() * dictionary.length)];
}

export function getRandomWordsFromDictionary(
	dictionary: Dictionary,
	count: number
) {
	const words: string[] = [];

	for (let i = 0; i < count; i++) {
		words.push(getRandomWordFromDictionary(dictionary));
	}
	return words;
}

const descriptionOptions: ParagraphOptions = {
	min: 2,
	max: 6,
	numOfWord: {
		min: 5,
		max: 12,
	},
};

export const postOptions: ArticleOptions = {
	min: 1,
	max: 5,
	numOfSentence: {
		min: 2,
		max: 10,
		numOfWord: {
			min: 5,
			max: 12,
		},
	},
};

export const commentOptions = {
	min: 1,
	max: 3,
	numOfSentence: {
		min: 2,
		max: 5,
		numOfWord: {
			min: 5,
			max: 12,
		},
	},
};

function getRandomInInterval(min: number, max: number) {
	return Math.floor((max - min) * Math.random() ** 2 + min);
}

function capitalizeFirstLetter(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function makeRandomSentence(
	dictionary: Dictionary,
	{ min, max }: SentenceOptions
) {
	const count = getRandomInInterval(min, max);
	const words = getRandomWordsFromDictionary(dictionary, count);
	words[0] = capitalizeFirstLetter(words[0]);
	return words.join(" ") + ".";
}

export function makeRandomParagraph(
	dictionary: Dictionary,
	{ min, max, numOfWord }: ParagraphOptions
) {
	const sentences: string[] = [];
	const count = getRandomInInterval(min, max);

	for (let i = 0; i < count; i++) {
		sentences.push(makeRandomSentence(dictionary, numOfWord));
	}

	return sentences.join(" ");
}

export function makeRandomPost(
	dictionary: Dictionary,
	{ min, max, numOfSentence }: ArticleOptions
) {
	const paragraphs: string[] = [];
	const count = getRandomInInterval(min, max);

	for (let i = 0; i < count; i++) {
		paragraphs.push(makeRandomParagraph(dictionary, numOfSentence));
	}

	return paragraphs.join("\n\n");
}

export function makeRandomComment(
	dictionary: Dictionary,
	commentOptions: ArticleOptions
) {
	return makeRandomPost(dictionary, commentOptions);
}

export function makeRandomDescription(dictionary: Dictionary) {
	return makeRandomParagraph(dictionary, descriptionOptions);
}

export async function fetchUsers(count: number) {
	const users: PrismaUserCreateArgs[] = [];
	const data = await axios.get(
		`https://randomuser.me/api/?results=${count}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	data.data.results.forEach((person: RandomUser) => {
		const {
			email,
			login: { username, password },
		} = person;
		users.push({ name: username, email, password });
	});

	return users;
}

type SentenceOptions = {
	min: number;
	max: number;
};

type ParagraphOptions = {
	min: number;
	max: number;
	numOfWord: SentenceOptions;
};

type ArticleOptions = {
	min: number;
	max: number;
	numOfSentence: ParagraphOptions;
};

export type Dictionary = string[];

type RandomUser = {
	login: {
		username: string;
		password: string;
	};
	email: string;
};
