<script lang="ts">
	import Select from 'svelte-select';
	import { onMount } from 'svelte';
	import { categories, selectFacilityValue } from '$lib/store/directoryStore';
	import * as m from "$msgs";	import { get } from '@square/svelte-store';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		getSelectCategories,
		getSelCatVal,
		getDirectoryRedirect,
		getSelectFacility,
	} from '$lib/components/Directory/context';
	import type { Type } from '$lib/store/directoryStoreInterface';

	export let categoryOf;
	export let types: string[]|null;

	const label = 'label';
	const itemId = 'value';

	let selectCategories = getSelectCategories();
	let selectFacility = getSelectFacility();
	let selCatVal = getSelCatVal();
	let directoryRedirect = getDirectoryRedirect();

	onMount(async () => {
		let _types: string[]|null = null;
		if (types) {
            _types = types;
		} else {
		    const typesParam: string | null = page.url.searchParams.get('types');
			if (typesParam) {
		        _types = JSON.parse(typesParam);
			}
		}
		if (!_types) {
			return;
		}
		selectCategories.set(_types);
		const _categories = await categories();
		const typesVal = getValue(_types, _categories);
		if (typesVal) {
			selCatVal.set(typesVal);
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

	function getValue(selectCategories: string[], categories: Type[]) {
		if (categories) {
			let val = categories
				.filter((x) => selectCategories.includes(x.uid))
				.map(function (x) {
					let dct = { value: x.uid, label: x.name };
					return dct;
				})[0];
			return val;
		}
	}

	/*function buildUrl() {
		//const searchParams = page.url.searchParams.get()
        //const parameters = page.url.searchParams.join('&');
		//let url = `${origin}`;
		//if (params.length) url += `?${parameters}`;
	};*/

	function handleClear(event: CustomEvent) {
		if (event.detail) {
			selectCategories.set([]);
			selCatVal.set(null);
			page.url.searchParams.delete('types');
		    goto(page.url.pathname+"?"+page.url.searchParams);
		    if (page.url.pathname != '/annuaire' && $directoryRedirect) {
				let url = '/annuaire';
				if ( $selectFacility ) {
					url += `?facility=${$selectFacility}`
				}
			    goto(url);
		    }
		}
	}

	function handleChange(event: CustomEvent) {
		if (event.detail && event.detail.value) {
			selectCategories.set([event.detail.value]);
			const typesParam = JSON.stringify(`[${event.detail.value}]`)
			let urlParams = `?types=${typesParam}`;
			if ( $selectFacility ) {
                urlParams += `&facility=${$selectFacility}`
			}
			if (page.url.pathname != '/annuaire' && $directoryRedirect) {
				goto(`/annuaire${urlParams}`);
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
	categoryOf: {$categoryOf} ({$categoryOf.length}) $selCatVal: {JSON.stringify($selCatVal)}<br />
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
