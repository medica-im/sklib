<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getTerm } from '$lib/components/Directory/context';
	import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import DocsIcon from '$lib/Icon/Icon.svelte';
	import * as m from "$msgs";
	const term = getTerm();
	let termParam: string | null = null;

	onMount(async () => {
		termParam = $page.url.searchParams.get('term');
		if (termParam) {
			term.set(termParam);
		}
	});
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
	<div class="input-group-shim"><Fa icon={faMagnifyingGlass} /></div>
	<input
		type="search"
		autocomplete="off"
		placeholder={m.ADDRESSBOOK_SEARCH_PLACEHOLDER()}
		bind:value={$term}
		aria-label={m.ADDRESSBOOK_SEARCH_ARIA_LABEL()}
	/>
	<button
		class="variant-filled-secondary"
		on:click={() => {
			$term = '';
		}}
		aria-label={m.ADDRESSBOOK_CLEAR()}
		disabled={!$term}
	>
		<DocsIcon name="clear" width="w-5" height="h-5" />
	</button>
</div>

<style lang="postcss">
	/* clears the ‘X’ from Internet Explorer */
	input[type='search']::-ms-clear {
		display: none;
		width: 0;
		height: 0;
	}
	input[type='search']::-ms-reveal {
		display: none;
		width: 0;
		height: 0;
	}
	/* clears the ‘X’ from Chrome */
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		display: none;
	}
</style>
