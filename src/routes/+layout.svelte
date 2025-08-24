<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Svelte Wordle</title>
</svelte:head>

<div class="space-y-4">
	<div class="h-14 border-b-2 border-zinc-200/20"></div>
	{@render children?.()}
</div>
