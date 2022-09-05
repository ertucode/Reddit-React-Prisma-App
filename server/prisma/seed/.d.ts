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

type Dictionary = string[];

type RandomUser = {
	login: {
		username: string;
		password: string;
	};
	email: string;
};
