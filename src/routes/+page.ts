import { answers, validGuesses } from './words.json';

export const load = async () => {
	return {
		keyboard: [
			['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
			['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
			['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
		],
		answers,
		validGuesses
	};
};
