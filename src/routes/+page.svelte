<script lang="ts">
	import { fade } from 'svelte/transition';

	const { data } = $props();

	let validWords = $derived([...data.answers, ...data.validGuesses]);
	let targetWord = $state(
		data.answers[Math.floor(Math.random() * data.answers.length)].toUpperCase()
	);
	let gameState = $state('playing'); // playing, win, loss
	let guesses = $state(Array(6).fill(''));
	let currentGuessIndex = $state(0);
	let currentInput = $state('');
	let keyboardLetterState = $state({}); // correct, present, absent
	let message = $state('');

	let getLetterState = (letter: string, letterIndex: number) => {
		if (!letter) return '';

		const isCorrectPosition = targetWord[letterIndex] === letter;
		const isLetterPresent = targetWord.includes(letter);

		if (isCorrectPosition) return 'correct';
		else if (isLetterPresent) return 'present';
		else return 'absent';
	};

	let handleSubmit = () => {
		if (currentInput.length !== 5) return;

		// check if guess is a valid word
		if (!validWords.includes(currentInput.toLowerCase())) {
			message = 'Not in word list';
			setTimeout(() => (message = ''), 3000);
			return;
		}

		// update list of guesses
		guesses[currentGuessIndex] = currentInput;
		currentGuessIndex += 1;

		// update keyboard letter state
		for (let i = 0; i <= currentInput.length; i++) {
			const letter = currentInput[i];
			const isCorrectPosition = targetWord[i] === letter;
			const isLetterPresent = targetWord.includes(letter);

			if (isCorrectPosition) keyboardLetterState[letter] = 'correct';
			else if (isLetterPresent && keyboardLetterState[letter] !== 'correct')
				keyboardLetterState[letter] = 'present';
			else if (!isLetterPresent) keyboardLetterState[letter] = 'absent';
		}

		// check if guess is correct word
		if (targetWord === currentInput) {
			message = 'You win, congratulations!';
			setTimeout(() => (message = ''), 3000);
			gameState = 'win';
		} else if (currentGuessIndex === 6) {
			message = 'You lose, the correct word was ' + targetWord;
			setTimeout(() => (message = ''), 3000);
			gameState = 'loss';
		}
		currentInput = '';
	};
</script>

<svelte:document
	onkeydown={(e) => {
		if (gameState !== 'playing') return;

		const key = e.key.toUpperCase();

		if (key === 'ENTER') {
			handleSubmit();
		} else if (key === 'BACKSPACE') {
			currentInput = currentInput.slice(0, -1);
		} else if (/^[A-Z]$/.test(key) && currentInput.length < 5) {
			currentInput += key;
		}
	}}
/>

{#if message.length > 0}
	<div
		class="absolute left-1/2 -translate-x-1/2 rounded-md bg-gray-50 p-3 text-center font-semibold text-zinc-900"
		transition:fade
	>
		{message}
	</div>
{/if}

<div class="mx-auto grid max-w-74 grid-cols-5 gap-1.5">
	{#each guesses as guess, rowIndex}
		{#each { length: 5 } as _, colIndex}
			{@const letter =
				rowIndex === currentGuessIndex ? currentInput[colIndex] || '' : guess[colIndex] || ''}
			{@const state = currentGuessIndex > rowIndex ? getLetterState(letter, colIndex) : ''}
			<div
				class={`flex aspect-square items-center justify-center border-2 border-zinc-200/20 text-2xl font-bold text-white 
				${
					state === 'correct'
						? 'bg-green-500'
						: state === 'present'
							? 'bg-amber-300'
							: state === 'absent'
								? 'bg-gray-500'
								: ''
				}`}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>

<!-- Keyboard -->
<div class="flex flex-col items-center gap-1.5">
	{#each data.keyboard as row, r}
		<div class="flex w-full max-w-96 justify-center gap-1.5">
			{#if r === 1}
				<div class="flex-[0.5]"></div>
			{/if}
			{#each row as key}
				<button
					onclick={() => {
						if (gameState !== 'playing') return;

						if (key === 'ENTER') {
							handleSubmit();
						} else if (key === '⌫') {
							currentInput = currentInput.slice(0, -1);
						} else if (currentInput.length < 5) {
							currentInput += key;
						}
					}}
					class={`min-h-12 rounded text-center font-bold text-white ${key === 'ENTER' ? 'flex-[1.5]' : 'flex-1'}  ${keyboardLetterState[key] === 'correct' ? 'bg-green-500' : keyboardLetterState[key] === 'present' ? 'bg-amber-300' : keyboardLetterState[key] === 'absent' ? 'bg-zinc-800' : 'bg-zinc-500 hover:bg-zinc-600'} ${key === 'ENTER' ? 'text-xs' : 'text-lg'}`}
				>
					{key}
				</button>
			{/each}
			{#if r === 1}
				<div class="flex-[0.5]"></div>
			{/if}
		</div>
	{/each}
	{#if gameState !== 'playing'}
		<div class="flex justify-center">
			<button
				onclick={() => {
					gameState = 'playing';
					guesses = Array(6).fill('');
					currentGuessIndex = 0;
					keyboardLetterState = {};
					targetWord = data.answers[Math.floor(Math.random() * data.answers.length)].toUpperCase();
				}}
				class="rounded bg-zinc-500 p-4 py-4 text-lg font-bold text-white hover:bg-zinc-600"
				>TRY AGAIN</button
			>
		</div>
	{/if}
</div>
