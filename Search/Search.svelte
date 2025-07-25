<script lang="ts">
	import { menuNavLinks } from '$var/variables.ts';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	// Classes
	const cBase =
		'bg-surface-100/60 dark:bg-surface-800/60 backdrop-blur-lg w-modal rounded-container-token max-h-[90%] md:max-h-[75%] overflow-y-auto';
	const cHeader = 'sticky top-0 z-10 bg-surface-100-800-token flex items-center space-x-4 p-4';
	const cList = 'p-4 space-y-4 rounded-container-token';
	const cCardLink = 'card bg-surface-200-700-token p-2 grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center';
	const cCardLinkFocus = 'hover:bg-primary-500 hover:text-on-primary-token focus:bg-primary-500 focus:text-on-primary-token';
	const cHashtag = 'border-2 border-surface-300-600-token rounded w-7 aspect-square flex justify-center items-center text-xs';

	const modalStore = getModalStore();

	// Local
	let searchTerm = '';
	let navigationOriginal: any[] = Object.values(menuNavLinks);
	let navigation: any[] = navigationOriginal;

	// Elements
	let elemDocSearch: HTMLElement;

	function filterList(list: any[]): any[] {
		return list.filter((rowObj: any) => {
			const formattedSearchTerm = searchTerm.toLowerCase() || '';
			return Object.values(rowObj).join(' ').toLowerCase().includes(formattedSearchTerm);
		});
	}

	function onSearch(): void {
		let navDeepCopy = JSON.parse(JSON.stringify(navigationOriginal));
		navigation = navDeepCopy.filter((category: any) => {
			category.list = filterList(category.list);
			if (category.list.length) return category;
		});
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (['Enter', 'ArrowDown'].includes(event.code)) {
			const queryFirstAnchorElement = elemDocSearch.querySelector('a');
			if (queryFirstAnchorElement) queryFirstAnchorElement.focus();
		}
	}
</script>

<div bind:this={elemDocSearch} class="docs-search {cBase}">
	<!-- Header -->
	<header class="docs-search-header {cHeader}">
		<i class="fa-solid fa-magnifying-glass text-xl"></i>
		<input class="input" bind:value={searchTerm} type="search" placeholder="Search..." on:input={onSearch} on:keydown={onKeyDown} />
		<!-- prettier-ignore -->
		<button aria-label="Fermer" class="btn-icon variant-filled btn-icon-sm" on:click={() => { modalStore.close(); }} tabindex="-1">
			<i class="fa-solid fa-xmark"></i>
		</button>
	</header>
	<hr />
	<!-- Results -->
	<div class="docs-search-categories {cList}">
		{#each navigation as category}
			<div class="space-y-4">
				<span>{category.title}</span>
				<nav class="grid grid-cols-1 gap-4">
					<ul class="space-y-4">
						{#each category.list as link}
							<li>
								<!-- prettier-ignore -->
								<a class="{cCardLink} {cCardLinkFocus}" href={link.href} on:click={() => { modalStore.close(); }}>
									<div class="{cHashtag}"><i class="fa-solid fa-hashtag"></i></div>
									<strong class="block text-lg">{link.label}</strong>
									<small class="text-xs opacity-50">{link.href}</small>
									<i class="fa-solid fa-angle-right text-xs opacity-30"></i>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>
		{/each}
	</div>
</div>
