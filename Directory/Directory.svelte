<script lang="ts">
	import { variables } from '$lib/utils/constants.ts';
	import { organizationStore } from '$lib/store/facilityStore.ts';
	import {
		categorizedFilteredEffectors,
		selectSituation,
		cardinalCategorizedFilteredEffectors,
		currentOrg,
		directoryRedirect,
		limitCategories,
		selectCategories,
		categories,
		fullFilteredEffectors
	} from '$lib/store/directoryStore.ts';
	import * as m from "$msgs";	import { capitalizeFirstLetter } from '$lib/helpers/stringHelpers.ts';
	import { language } from '$lib/store/languageStore.ts';
	import SearchDirectory from '$lib/Directory/SearchDirectory.svelte';
	import Entry from '$lib/components/Directory/Entry.svelte';
	import SelectCommunes from './SelectCommunes.svelte';
	import SelectCategories from './SelectCategories.svelte';
	import SelectCategoriesChips from './SelectCategoriesChips.svelte';
	import SelectSituations from './SelectSituations.svelte';
	import SelectFacility from '$lib/Directory/SelectFacility.svelte';
	import Geocoder from '$lib/components/Geocoder/Geocoder.svelte';
	import Fa from 'svelte-fa';
	import { faArrowsUpToLine } from '@fortawesome/free-solid-svg-icons';
	import Spinner from '$lib/Spinner/Spinner.svelte';
	import { scrollY } from '$lib/store/scrollStore.ts';
	import Clear from '$lib/Directory/Clear.svelte';
	
	export let data: any = null;
	export let displayGeocoder: boolean = variables.INPUT_GEOCODER;
	export let displaySituation: boolean = variables.INPUT_SITUATION;
	export let displayCommune: boolean = variables.INPUT_COMMUNE;
	export let displayCategory: boolean = variables.INPUT_CATEGORY;
	export let displayFacility: boolean = variables.INPUT_FACILITY;
	export let displaySearch: boolean = variables.INPUT_SEARCH;
	export let setCurrentOrg: boolean | null = true;
	export let setRedirect: boolean = true;
	export let setLimitCategories:string[] = [];
	export let avatar: boolean = true;

	$: {
	$currentOrg=setCurrentOrg;
	$directoryRedirect=setRedirect;
	$limitCategories=setLimitCategories;
	}

	let top: Element;
	let category = '';
	let countString = '';
	function section(c: string): void {
		category = c;
	}
	let showOnPx = 500;
	function contactCount(_categorizedFilteredEffectors: Map<string,any>) {
		let count = 0;
		if (_categorizedFilteredEffectors) {
			count = [..._categorizedFilteredEffectors.values()].flat().length;
		}
		return `${count} contact${count > 1 ? 's' : ''}`;
	}
	$: countString = contactCount($cardinalCategorizedFilteredEffectors);
	const scrollToTop = () => {
		top.scrollIntoView();
	};
</script>

<svelte:window bind:scrollY={$scrollY} />

<svelte:head>
	<title>
		{m.ADDRESSBOOK_TITLE()} - {capitalizeFirstLetter($organizationStore.formatted_name, $language)}
	</title>
</svelte:head>

<div>
	<section id="programs" class="bg-surface-100-800-token programs-gradient">
		<div class="section-container" bind:this={top}>
			<div class="space-y-2">
				{#if displayGeocoder}
					<div class="row">
						<div class="col">
							<Geocoder />
						</div>
					</div>
				{/if}
				{#if displaySituation}
					<div class="row">
						<div class="col">
							<SelectSituations />
						</div>
					</div>
				{/if}
				{#if displayCommune}
					<div class="row">
						<div class="col">
							<SelectCommunes />
						</div>
					</div>
				{/if}
				{#if displayCategory}
					{#if $selectSituation}
						<div class="row">
							<div class="col">
								<SelectCategoriesChips />
							</div>
						</div>
					{:else}
						<div class="row">
							<div class="col">
								<SelectCategories />
							</div>
						</div>
					{/if}
				{/if}
				{#if displayFacility}
					<div class="row">
						<div class="col">
							<SelectFacility />
						</div>
					</div>
				{/if}
				{#if displaySearch}
					<div class="row">
						<div class="col">
							<SearchDirectory />
						</div>
					</div>
				{/if}
				{#await cardinalCategorizedFilteredEffectors.load()}
					{#if data?.cardinal && [...data?.cardinal]?.length}
						<div class="my-2 flex justify-between w-full">
							<span class="badge variant-ghost-surface">{contactCount(data.cardinal)}</span>
							<span class="inline-flex items-center space-x-2">
								<Spinner w={4} h={4} />
								<span>Mise à jour...</span>
							</span>
							<Clear />
						</div>
						<div class="my-4 space-y-4">
							{#each [...data.cardinal] as [key, value]}
								<div class="space-y-4 my-4 anchordiv" id={key}>
									<div class="relative inline-block">
										<span class="badge-icon variant-filled-primary absolute -top-2 -right-3 z-5">
											{value.length}
										</span>

										<span class="badge variant-filled"
											><h4 class="h4">{capitalizeFirstLetter(key)}</h4></span
										>
									</div>
								</div>
								<div class="grid lg:grid-cols-2 gap-4">
									{#each value as entry}
										<div class="space-y-4 my-4">
											<Entry {entry} {avatar} />
										</div>
									{/each}
								</div>
							{/each}
						</div>
					{:else}
						<div class="flex justify-center m-4 space-x-2 items-center">
							<Spinner w={4} h={4} />
							<p>Chargement...</p>
						</div>
					{/if}
				{:then}
					<div class="my-4 space-y-4">
						<div class="my-2 flex justify-between w-full">
							<span class="badge variant-ghost-surface"
								>{contactCount($cardinalCategorizedFilteredEffectors)}</span
							>
							<Clear />
						</div>
						{#each [...$cardinalCategorizedFilteredEffectors] as [key, value]}
							<div class="space-y-4 my-4 anchordiv" id={key}>
								<div class="relative inline-block">
									<span class="badge-icon variant-filled-primary absolute -top-2 -right-3 z-5">
										{value.length}
									</span>

									<span class="badge variant-filled"
										><h4 class="h4">{capitalizeFirstLetter(key)}</h4></span
									>
								</div>
							</div>
							<div class="grid lg:grid-cols-2 gap-4">
								{#each value as entry}
									<div class="space-y-4 my-4">
										<Entry {entry} {avatar} />
									</div>
								{/each}
							</div>
						{/each}
					</div>
				{/await}
			</div>
		</div>
	</section>
</div>

{#if $scrollY > showOnPx}
	<button type="button" class="back-to-top btn-icon btn-lg variant-filled" on:click={scrollToTop}>
		<Fa icon={faArrowsUpToLine} size="lg" /></button
	>
{/if}

<style lang="postcss">
	.anchordiv {
		scroll-margin-top: 1rem;
	}
	.section-container {
		@apply w-full max-w-7xl mx-auto p-4 py-4 md:py-8;
		scroll-padding-top: 4rem;
	}
	.programs-gradient {
		background-image: radial-gradient(
				at 0% 0%,
				rgba(var(--color-secondary-500) / 0.33) 0px,
				transparent 50%
			),
			radial-gradient(at 100% 0%, rgba(var(--color-primary-500) / 0.33) 0px, transparent 50%);
	}
	.back-to-top {
		position: fixed;
		z-index: 99;
		right: 15px;
		user-select: none;
		bottom: 15px;
	}
</style>
