<script lang="ts">
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	import { categories, selectCategories, selCatVal, categoryOf, directoryRedirect } from '$lib/store/directoryStore';
	import * as m from "$msgs";	import { get } from '@square/svelte-store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const label = 'label';
	const itemId = 'value';

	onMount(async () => {
		if ($selectCategories) {
			const cats = await categories();
			$selCatVal = getValue($selectCategories, cats);
		}
	});

	function getItems(elements) {
		return elements
			.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			})
			.map(function (x) {
				let dct = { value: x.uid, label: x.name };
				return dct;
			});
	}

	function getValue(selectCategories: string[], categories) {
		let sElements = selectCategories || get(selectCategories);
		if (!sElements?.length) {
			return null;
		} else {
			if (categories) {
				let val = categories
					.filter((x) => sElements.includes(x.uid))
					.map(function (x) {
						let dct = { value: x.uid, label: x.name };
						return dct;
					})[0];
				return val;
			}
		}
	}

	function handleClear(event) {
		if (event.detail) {
			selectCategories.set([]);
		}
		const pageStore = get(page);
		if (pageStore.params && $directoryRedirect) {
			goto('/annuaire');
		}
	}

	function handleChange(event) {
		if (event.detail && event.detail.value) {
			selectCategories.set([event.detail.value]);
			if ($page.url.pathname != '/annuaire' && $directoryRedirect) {
				goto('/annuaire');
			}
		}
	}
</script>

{#await categoryOf.load()}
	<div class="text-surface-700 theme">
		<Select loading={true} placeholder={m.ADDRESSBOOK_CATEGORIES_PLACEHOLDER()} />
	</div>
{:then}
	<!--
categories: {$categories} ({$categories.length})<br>
categoryOf: {$categoryOf} ({$categoryOf.length})
$selCatVal: {$selCatVal}<br>
$selectCategories: {JSON.stringify($selectCategories)}
-->
	<div class="text-surface-700 z-auto theme">
		<Select
			{label}
			{itemId}
			items={getItems($categoryOf)}
			searchable={false}
			on:change={handleChange}
			on:clear={handleClear}
			placeholder={m.ADDRESSBOOK_CATEGORIES_PLACEHOLDER()}
			bind:value={$selCatVal}
		/>
	</div>
{/await}

<style>
	/*
			CSS variables can be used to control theming.
			https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md
	*/
	.theme {
		--border-radius: var(--theme-rounded-container);
		--border-color: rgb(var(--color-secondary-500));
		--border-focused: 1px solid rgb(var(--color-secondary-500));
		--border-hover: 1px solid rgb(var(--color-secondary-500));
		--item-active-outline: 1px solid rgb(var(--color-secondary-500));
		--item-outline: 1px solid rgb(var(--color-secondary-500));
		--clear-select-focus-outline: 1px solid rgb(var(--color-secondary-500));
		--height: 3rem;
	}
</style>
