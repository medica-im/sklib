<script lang="ts">
	import type { Facility } from '$lib/interfaces/facility.interface';
	import Fa from 'svelte-fa';
	import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
	export let data: Facility;
</script>

{#if data}
<a href="/sites/{data.slug}" class="unstyled underline underline-offset-4 flex gap-2 items-center">
	<span>
		<Fa icon={faLocationDot}/>
	</span>
	<span>
		{data.label||data.name}
	</span>
</a>
{/if}